package Impl

import APIs.AdminAPI.RegisterMessage
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

import java.util.Properties
import javax.mail.*
import javax.mail.internet.*
import scala.util.{Random, Try}

case class SendCodeMessagePlanner(userEmail:String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    val properties = new Properties()
    properties.put("mail.smtp.auth", "true")
    properties.put("mail.smtp.starttls.enable", "true")
    properties.put("mail.smtp.host", "smtp.qq.com")
    properties.put("mail.smtp.port", "587")
    val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    val random = new Random
    val verificationCode = (1 to 6).map(_ => chars(random.nextInt(chars.length))).mkString
    val session = Session.getInstance(properties, new javax.mail.Authenticator() {
      override protected def getPasswordAuthentication(): PasswordAuthentication = {
        new PasswordAuthentication("g191126@qq.com", "ojlzgfqkznyydfjd")
      }
    })
    val message = new MimeMessage(session)
    message.setFrom(new InternetAddress("g191126@qq.com"))
    message.setRecipients(Message.RecipientType.TO, userEmail)
    message.setSubject("Welcome to Novel Platform! Yay!")
    message.setText(s"Your verification code is: $verificationCode")
    val checkEmailExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminverificationcode WHERE adminemail = ?)",
      List(SqlParameter("String", userEmail))
    )
    Transport.send(message)
    checkEmailExists.flatMap { emailExists =>
      if (emailExists) {
        writeDB(s"UPDATE ${schemaName}.adminemail_adminverificationcode SET adminverificationcode = ? WHERE adminemail = ?",
          List(SqlParameter("String", verificationCode),
            SqlParameter("String", userEmail)
          ))
      } else {
        writeDB(s"INSERT INTO ${schemaName}.adminemail_adminverificationcode (adminemail, adminverificationcode) VALUES (?, ?)",
          List(SqlParameter("String", userEmail),
            SqlParameter("String", verificationCode)
          ))
      }
    }
  }

