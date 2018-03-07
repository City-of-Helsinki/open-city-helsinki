package nativemodules;

import java.util.regex.Pattern;

/**
 * Created by niko on 7.3.2018.
 */

public class CardInfo {

    private String cardNumber;
    private Integer cardPin;
    private final Pattern nfcCardNumberPattern = Pattern.compile("^\\d{14}$");

    public CardInfo(String cardNumber, int cardPin) {
      setCardNumber(cardNumber);
      setCardPin(cardPin);
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) throws IllegalArgumentException {
        if (nfcCardNumberPattern.matcher(cardNumber).matches()) {
            this.cardNumber = cardNumber;
        } else {
            throw new IllegalArgumentException();
        }

    }

    public Integer getCardPin() {
        return cardPin;
    }

    public void setCardPin(Integer cardPin) {
        this.cardPin = cardPin;
    }

}
