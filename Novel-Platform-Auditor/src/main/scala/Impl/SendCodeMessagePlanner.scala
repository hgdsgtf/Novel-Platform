package Impl

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
import java.sql.SQLException

case class SendCodeMessagePlanner(
    userEmail: String,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    def generateVerificationCode(): String = {
      val chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      val random = new Random
      (1 to 6).map(_ => chars(random.nextInt(chars.length))).mkString
    }

    def sendEmail(userEmail: String, verificationCode: String): Unit = {
      val properties = new Properties()
      properties.put("mail.smtp.host", "smtp.qq.com")
      properties.put("mail.smtp.port", "587")
      properties.put("mail.smtp.auth", "true")
      properties.put("mail.smtp.starttls.enable", "true")

      val session = Session.getInstance(
        properties,
        new javax.mail.Authenticator() {
          override protected def getPasswordAuthentication
              : PasswordAuthentication = {
            new PasswordAuthentication("g191126@qq.com", "ojlzgfqkznyydfjd")
          }
        }
      )

      val message = new MimeMessage(session)
      message.setFrom(new InternetAddress("g191126@qq.com"))
      message.setRecipients(Message.RecipientType.TO, userEmail)
      message.setSubject("Hello, new auditor! Welcome to Novel Platform! Yay!")
      message.setText(s"Your verification code is: $verificationCode")

      Transport.send(message)
    }

    def handleDatabaseOperations(
        userEmail: String,
        verificationCode: String,
        schemaName: String
    ): IO[Unit] = {
      val checkEmailExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.auditoremail_auditorverificationcode WHERE auditoremail = ?)",
        List(SqlParameter("String", userEmail))
      )

      checkEmailExists.attempt.flatMap {
        case Right(emailExists) =>
          val query = if (emailExists) {
            s"UPDATE ${schemaName}.auditoremail_auditorverificationcode SET auditorverificationcode = ? WHERE auditoremail = ?"
          } else {
            s"INSERT INTO ${schemaName}.auditoremail_auditorverificationcode (auditoremail, auditorverificationcode) VALUES (?, ?)"
          }
          val params = List(
            SqlParameter("String", userEmail),
            SqlParameter("String", verificationCode)
          )
          writeDB(query, params).attempt.flatMap {
            case Right(_)              => IO.unit
            case Left(e: SQLException) => IO.raiseError(SQLError(e))
            case Left(e)               => IO.raiseError(UnknownError(e))
          }
        case Left(e: SQLException) => IO.raiseError(SQLError(e))
        case Left(e)               => IO.raiseError(UnknownError(e))
      }
    }
    try {
      val verificationCode = generateVerificationCode()
      sendEmail(userEmail, verificationCode)
      handleDatabaseOperations(userEmail, verificationCode, schemaName).map(_ =>
        "Verification code sent successfully"
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
