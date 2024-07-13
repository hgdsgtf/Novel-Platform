package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import cats.data.EitherT
import cats.implicits._
import io.circe.generic.auto._

import java.util.Properties
import javax.mail._
import javax.mail.internet._
import scala.util.Random
import scala.util.Try

sealed trait SendCodeError {
  def message: String
}

object SendCodeError {
  case class EmailSendError(message: String = "Failed to send email")
      extends SendCodeError
  case class DatabaseError(message: String = "Database error")
      extends SendCodeError
  case class SystemError(message: String = "System error") extends SendCodeError
}

import SendCodeError._

case class UserSendCodeMessagePlanner(
    userEmail: String,
    override val planContext: PlanContext
) extends Planner[Either[SendCodeError, String]] {

  private val properties = new Properties()
  properties.put("mail.smtp.auth", "true")
  properties.put("mail.smtp.starttls.enable", "true")
  properties.put("mail.smtp.host", "smtp.qq.com")
  properties.put("mail.smtp.port", "587")

  private val chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  private val random = new Random
  private val verificationCode =
    (1 to 6).map(_ => chars(random.nextInt(chars.length))).mkString

  private def sendEmail(): EitherT[IO, SendCodeError, Unit] = EitherT {
    IO {
      val session = Session.getInstance(
        properties,
        new javax.mail.Authenticator() {
          override protected def getPasswordAuthentication()
              : PasswordAuthentication = {
            new PasswordAuthentication("g191126@qq.com", "ojlzgfqkznyydfjd")
          }
        }
      )
      val message = new MimeMessage(session)
      message.setFrom(new InternetAddress("g191126@qq.com"))
      message.setRecipients(Message.RecipientType.TO, userEmail)
      message.setSubject("Welcome to Novel Platform! Yay!")
      message.setText(s"Your verification code is: $verificationCode")

      Try(Transport.send(message)).toEither.left.map(e =>
        EmailSendError(s"Failed to send email: ${e.getMessage}")
      )
    }.attempt.map {
      case Right(result) => result
      case Left(e) =>
        Left(SendCodeError.SystemError(s"System error: ${e.getMessage}"))
    }
  }

  private def checkEmailExists()(implicit
      planContext: PlanContext
  ): EitherT[IO, SendCodeError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userVerification WHERE email = ?)",
        List(SqlParameter("String", userEmail))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(SendCodeError.DatabaseError(s"Database error: ${e.getMessage}"))
      }
    }

  private def updateVerificationCode(
      emailExists: Boolean
  )(implicit planContext: PlanContext): EitherT[IO, SendCodeError, String] =
    EitherT {
      val query = if (emailExists) {
        s"UPDATE ${schemaName}.userVerification SET verificationCode = ? WHERE email = ?"
      } else {
        s"INSERT INTO ${schemaName}.userVerification (email, verificationCode) VALUES (?, ?)"
      }

      val parameters = if (emailExists) {
        List(
          SqlParameter("String", verificationCode),
          SqlParameter("String", userEmail)
        )
      } else {
        List(
          SqlParameter("String", userEmail),
          SqlParameter("String", verificationCode)
        )
      }

      writeDB(
        query,
        parameters
      ).attempt.map {
        case Right(_) => Right("Verification code sent successfully")
        case Left(e) =>
          Left(SendCodeError.DatabaseError(s"Database error: ${e.getMessage}"))
      }
    }

  override def plan(using
      planContext: PlanContext
  ): IO[Either[SendCodeError, String]] = {
    (for {
      _ <- sendEmail()
      emailExists <- checkEmailExists()
      result <- updateVerificationCode(emailExists)
    } yield result).value
  }
}
