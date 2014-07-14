class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def twitter
    logger = Logger.new("log/development.log")
    logger.debug("OMNIAUTH DEBUG:")
    # logger.log(request.env["omniauth.auth"].class)
    user = User.find_for_oauth(request.env["omniauth.auth"])
    
    logger.debug(user)

    if user.persisted?
      logger.debug("PERSISTED")
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "twitter"
      sign_in_and_redirect user, :event => :authentication
    else
      logger.debug("ELSE")
      # logger.log(request.env["omniauth.auth"].class)
      session["devise.twitter_data"] = request.env["omniauth.auth"].except("extra")
      # logger.debug(session["devise.twitter_data"])
      # logger.debug("NAME")
      # logger.debug(session["devise.twitter_data"]["info"]["name"])

      # user_info = session["devise.twitter_data"]["info"]

      # User.create(first_name: user_info["name"], email: user_info["email"], avatar: user_info["image"])

      redirect_to new_user_registration_url
    end
  end
end
