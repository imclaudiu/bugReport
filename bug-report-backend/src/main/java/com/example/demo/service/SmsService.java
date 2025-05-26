package com.example.demo.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.phone.number}")
    private String fromNumber;


    public void sendSms(String toNumber, String text) {
        Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber),
                text
        ).create();
    }
}
