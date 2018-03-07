package nativemodules;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import services.HostCardEmulationService;

/**
 * Created by niko on 7.3.2018.
 */

public class RNHostCardEmulationManager extends ReactContextBaseJavaModule {
    private static final String NAME = "HostCardManager";
    private static final String CARD_NUMBER = "cardNumber";
    private static final String CARD_PIN = "cardPin";

    public RNHostCardEmulationManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return RNHostCardEmulationManager.NAME;
    }

    private SharedPreferences getPreferences() {
        //TODO Check mode
        return getReactApplicationContext().getSharedPreferences("local_storage", 0);
    }

    @ReactMethod
    public void setCardInfo(ReadableMap map, final Promise promise) {

        CardInfo cardInfo;

        try {
            cardInfo = new CardInfo(
                    map.getString(CARD_NUMBER),
                    map.getInt(CARD_PIN)
            );

            Set<String> cards = new HashSet<String>();
            cards.add(cardInfo.getCardNumber() + "/" + Integer.toString(cardInfo.getCardPin()));

            getPreferences().edit().putStringSet("libraryCards", cards).apply();

            promise.resolve("Success");

        } catch (IllegalArgumentException e) {
            promise.reject("Card number invalid", e);
        }

    }


    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }

    @ReactMethod
    public void getCards(final Promise promise) {
       Set<String> cards = getPreferences().getStringSet("libraryCards", new HashSet<String>());
       promise.resolve(cards);
    }

    @ReactMethod
    public void startNfcService() {
        Log.d("HelsinkiNFC", "Starting service...");
        Intent intent = new Intent(getReactApplicationContext(), HostCardEmulationService.class);
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void stopNfcService() {
        Log.d("HelsinkiNFC", "Stopping service...");
        Intent intent = new Intent(getReactApplicationContext(), HostCardEmulationService.class);
        getReactApplicationContext().stopService(intent);
    }

}
