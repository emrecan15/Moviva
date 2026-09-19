package com.filmonersene.website.services.abstracts;

public interface EmailService {
	void sendSimpleMessage(String to, String subject, String text);
}
