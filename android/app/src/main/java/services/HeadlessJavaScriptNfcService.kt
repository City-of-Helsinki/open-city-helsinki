package services

import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments
import android.content.Intent
import android.util.Log

class HeadlessJavaScriptNfcService : HeadlessJsTaskService() {

    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        Log.d("HelsinkiHeadlessJavaScriptNfcService", "get headless task config")
        val extras = intent.getExtras()
        if (extras != null) {
            return HeadlessJsTaskConfig(
                "NfcHeadlessTask",
                Arguments.fromBundle(extras),
                23000, // TODO: remove
                true);
        }
        return null
    }
}
