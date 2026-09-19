package com.filmonersene.website.services.concretes;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.filmonersene.website.exceptions.*;
import com.filmonersene.website.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filmonersene.website.dtos.request.ChangePasswordRequest;
import com.filmonersene.website.dtos.request.CreateUserRequest;

import com.filmonersene.website.dtos.request.UpdateUserRequest;
import com.filmonersene.website.dtos.response.ChangePasswordResponse;
import com.filmonersene.website.dtos.response.CreateUserResponse;
import com.filmonersene.website.dtos.response.ForgotPasswordResponse;
import com.filmonersene.website.dtos.response.GetUserInfoResponse;
import com.filmonersene.website.dtos.response.UpdateUserResponse;
import com.filmonersene.website.entities.Role;
import com.filmonersene.website.entities.Tag;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.entities.VerificationToken;
import com.filmonersene.website.services.abstracts.EmailService;
import com.filmonersene.website.services.abstracts.UserService;
import com.filmonersene.website.utils.Constants;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserManager implements UserService {

	@Value("${app.base-url}")
	private String baseUrl;

	@Value("${app.frontend-url}")
	private String frontendUrl;
	
	private final UserRepository userRepository;
	private final TagRepository tagRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	private final VerificationTokenRepository tokenRepository;
	private final EmailService emailService;
	private final MovieRepository movieRepository;
	private final CommentRepository commentRepository;
	private final MovieLikeRepository movieLikeRepository;


	@Override
	@Transactional
	public CreateUserResponse createUser(CreateUserRequest createUserRequest) {

		
		if(userRepository.existsByEmail(createUserRequest.getEmail()) || userRepository.existsByUsername(createUserRequest.getUsername()))
		{
			throw new UserAlreadyExistsException("Daha önce kayıt oldunuz. Lütfen giriş yapın.");
		}
		// name-surname fields disabled
		User user = new User();
		user.setUsername(createUserRequest.getUsername());
		//user.setName(capitalizeName(createUserRequest.getName()));
		user.setEmail(createUserRequest.getEmail());
		//user.setSurname(capitalizeName(createUserRequest.getSurname()));
		user.setPassword(passwordEncoder.encode(createUserRequest.getPassword()));
		user.setName("");
		user.setSurname("");
		
		Tag tag = tagRepository.findById(Constants.DEFAULT_TAG_ID)
				.orElseThrow(() -> new TagNotFoundException("Tag bulunamadı"));
		
		user.setTag(tag);
		
		Role role = roleRepository.findById(Constants.DEFAULT_ROLE_ID)
				.orElseThrow(() -> new RoleNotFoundException("Rol bulunamadı"));
		user.setRole(role);
		userRepository.save(user);
		
		String token = UUID.randomUUID().toString();
		VerificationToken vToken = new VerificationToken(token, user,LocalDateTime.now().plusDays(1));
		tokenRepository.save(vToken);
		
		
		
		String subject = "Hesap Doğrulama";
		String body = "Merhaba, hesabınızı doğrulamak için şu linke tıklayın:\n" 
		              + baseUrl +"/auth/verify?token=" + token;
		
		emailService.sendSimpleMessage(user.getEmail(), subject, body);
		
		
		return new CreateUserResponse("E-posta doğrulama linki gönderildi. Lütfen e-postanızı kontrol edin.");
	}


	@Override
	public GetUserInfoResponse getUserInfo(UserDetails userDetails) {
		log.info("getUserInfo çalıştırıldı : "+userDetails.getUsername());
		String userName = userDetails.getUsername();
		User user = userRepository.findByEmail(userName)
				.orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı."));
		int recommendedMovieCount = movieRepository.countByRecommendedBy_Id(user.getId());
		int commentCount = commentRepository.countByUser_Id(user.getId());
		int voteCount = movieLikeRepository.countByUser_Id(user.getId());
		
		return new GetUserInfoResponse(null,user.getUsername(),user.getEmail(),user.getBio(),recommendedMovieCount,commentCount,voteCount,user.getCreatedAt());
	}


	@Override
	@Transactional
	public UpdateUserResponse updateUser(UserDetails userDetails,UpdateUserRequest updateUserRequest) {
		User user = userRepository.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new UserNotFoundException("Eşleşen kullanıcı bulunamadı: " + userDetails.getUsername()));

		if (!user.getUsername().equals(updateUserRequest.getUsername())) {
			boolean isUsernameTaken = userRepository.existsByUsername(updateUserRequest.getUsername());
			if (isUsernameTaken) {
				throw new UsernameAlreadyExistsException("Bu kullanıcı adı zaten kullanılıyor.");
			}
		}

		user.setUsername(updateUserRequest.getUsername());
		user.setBio(updateUserRequest.getBio());
		userRepository.save(user);


		return new UpdateUserResponse(user.getUsername(), user.getBio());
	}
	

	@Override
	@Transactional
	public ChangePasswordResponse changePassword(UserDetails userDetails, ChangePasswordRequest changePasswordRequest) {


		String currentPasswordOnUserDetails = userDetails.getPassword(); // hashed password
	    String currentPasswordByRequest = changePasswordRequest.getCurrentPassword(); // plain password

	    if (!passwordEncoder.matches(currentPasswordByRequest, currentPasswordOnUserDetails)) {
			throw new InvalidParameterException("Mevcut şifre yanlış.");

		}

	    User user = userRepository.findByEmail(userDetails.getUsername())
	            .orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));

	    String newEncodedPassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());
	    user.setPassword(newEncodedPassword);
	    
	    return new ChangePasswordResponse("Şifre başarıyla değiştirildi.");
		
	}


	@Override
	public ForgotPasswordResponse forgotPassword(String email) {
		log.info("Şifre sıfırlama talebi : "+email);
		Optional<User> userOpt = userRepository.findByEmail(email);
		
		if (userOpt.isEmpty()) {
		    return new ForgotPasswordResponse("");
		}
		else {
			
			User user = userOpt.get();
			tokenRepository.deleteByUser(user);
			
			String token = UUID.randomUUID().toString();
			LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
			
			VerificationToken verificationToken = new VerificationToken(token, user, expiryDate);
			tokenRepository.save(verificationToken);
			
			String resetLink = frontendUrl +"/sifre-sifirlama?token=" + token;
			
			String userName = user.getName();

			String message = """
			    Merhaba %s,

			    Moviva hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:

			    %s

			    Bu bağlantı yalnızca 15 dakika boyunca geçerlidir. Süre dolarsa yeniden şifre sıfırlama talebinde bulunmanız gerekir.

			    Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı göz ardı edin. Hesabınız güvende.

			    Sevgiler,
			    moviva.com.tr
			    """.formatted(userName, resetLink);
			
			emailService.sendSimpleMessage(email,"Şifre Sıfırlama Talebi",message);
			return new ForgotPasswordResponse("Eğer kayıtlı bir e-posta ise, şifre sıfırlama linki gönderildi.");
			
			
		}
		
	}



	
	
	

}
