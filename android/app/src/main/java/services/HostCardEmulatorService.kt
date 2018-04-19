package services;

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.os.Binder
import android.util.Log
import android.preference.PreferenceManager

import java.nio.ByteBuffer
import java.nio.CharBuffer
import java.nio.charset.Charset
import java.nio.charset.CharsetEncoder

import services.statusResponse
import services.dataResponse
import services.defaultErrorResponse

import services.ReactBridgeState
import services.ChangeListener


/**
 * Created by tituomin on 6.2.2018.
 */
class HostCardEmulatorService: ChangeListener, HostApduService() {
    var applicationSelected = false
    var interfaceDeviceId: String? = null
    var sendingData = false
    var dataBuffer: ByteBuffer? = null
    var apdu: Apdu? = null

    companion object {
        val TAG = "HelsinkiHostCardEmulator"
        val AID = Utils.hexStringToByteArray("F074756E6E697374616D6F")
        val RESPONSE_DATA = ByteArray(700, {i -> (0x41 + i % 58).toByte()})
        val ASCII_CHARSET = Charset.forName("US-ASCII")
    }

    fun logResponse(data: ByteArray): ByteArray {
        Log.d(TAG, "Responding with: " + Utils.toHex(data))
        return data
    }

    override fun onDeactivated(reason: Int) {
        resetState()
        Log.d(TAG, "Deactivated: " + reason)
    }

    fun resetState() {
        applicationSelected = false
        interfaceDeviceId = null
        sendingData = false
        dataBuffer = null
        apdu = null
    }

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray? {
        Log.d(TAG, this.toString())
        if (commandApdu == null) {
            return defaultErrorResponse()
        }

        val apdu = Apdu(commandApdu)
        Log.d(TAG, apdu.toString())

        val errorStatus = apdu.errorStatus()
        if (errorStatus != null) {
            return logResponse(statusResponse(errorStatus))
        }
        if (apdu.instruction == Apdu.Instruction.SELECT) {
            if (apdu.data != null && apdu.data contentEquals AID) {
                applicationSelected = true
                return logResponse(statusResponse(Apdu.Status.SUCCESS))
            }
        }
        if (apdu.instruction == Apdu.Instruction.EXTERNAL_AUTHENTICATE) {
            if (apdu.parameter1 == 1 && apdu.parameter2 == 1) {
                // Receive interface device id
                if (apdu.data != null) {
                    interfaceDeviceId = ASCII_CHARSET.decode(ByteBuffer.wrap(apdu.data)).toString()
                    return logResponse(statusResponse(Apdu.Status.SUCCESS))
                }
            }
            else if (apdu.parameter1 == 1 && apdu.parameter2 == 2) {
                // Receive nonce
                if (apdu.data != null) {
                    if (isValidNonce(apdu.data)) {
                        val ctx = ReactBridgeState.getReactContext()
                        if (ctx != null) {
                            val prefs = ctx.getSharedPreferences("local_storage", 0)
                            // FIXME: support multiple cards/pins?
                            val card = prefs.getStringSet("libraryCards", HashSet<String>()).firstOrNull()
                            if (card != null) {
                                val (number, pin) = card.split("/")
                                Log.d(TAG, pin)
                                return logResponse(dataResponse(pin.toByteArray(ASCII_CHARSET), Apdu.Status.SUCCESS))
                            }
                        }
                    }
                    return logResponse(defaultErrorResponse())
                }
            }
        }
        val interfaceDeviceId = this.interfaceDeviceId
        if (apdu.instruction == Apdu.Instruction.INTERNAL_AUTHENTICATE &&
            apdu.parameter1 == 1 && apdu.parameter2 == 1 &&
            applicationSelected && interfaceDeviceId != null) {
                ReactBridgeState.setChangeListener(this)
                ReactBridgeState.sendEvent(interfaceDeviceId)
                this.sendingData = true
                this.apdu = apdu
                return null
        }
        if (apdu.instruction == Apdu.Instruction.GET_RESPONSE) {
            return logResponse(chainedDataResponse(dataBuffer, apdu.expectedLength))
        }
        return logResponse(defaultErrorResponse())
    }

    fun isValidNonce(nonce: ByteArray): Boolean { // FIXME receive current nonce from javasript
        val decoded = ASCII_CHARSET.decode(ByteBuffer.wrap(nonce)).toString()
        return true
    }

    override fun onChange(token: String) { // FIXME receive nonce here
        val apdu = this.apdu
        if (!this.sendingData || apdu == null) {
            return
        }
        this.dataBuffer = ASCII_CHARSET.encode(token)
        this.sendingData = false
        sendResponseApdu(logResponse(chainedDataResponse(dataBuffer, apdu.expectedLength)))
        this.apdu = null
    }
}
