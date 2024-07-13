package Impl

import cats.effect.IO
import cats.data.EitherT
import cats.implicits.*
import io.circe.generic.auto.*
import Common.API.{API, PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import Common.PasswordUtils
import Global.ServiceCenter.{
  auditorServiceCode,
  readerServiceCode,
  writerServiceCode
}

sealed trait RegistrationError extends Exception {
  def message: String
}

object RegisterError {
  case class UserAlreadyRegistered(message: String = "User already exists")
      extends RegistrationError
  case class EmailAlreadyRegistered(message: String = "Email already exists")
      extends RegistrationError
  case class VerificationFailed(message: String = "Verification failed")
      extends RegistrationError
  case class SystemError(message: String = "System error")
      extends RegistrationError
}

case class UserRegisterMessagePlanner(
    userName: String,
    userEmail: String,
    password: String,
    verificationCode: String,
    userType: Int,
    override val planContext: PlanContext
) extends Planner[Either[RegistrationError, String]] {

  private def checkUserExists(implicit
      planContext: PlanContext
  ): EitherT[IO, RegistrationError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE userName = ?)",
        List(SqlParameter("String", userName))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(RegisterError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  private def checkEmailExists(implicit
      planContext: PlanContext
  ): EitherT[IO, RegistrationError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE email = ?)",
        List(SqlParameter("String", userEmail))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(RegisterError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  private def checkVerificationCode(implicit
      planContext: PlanContext
  ): EitherT[IO, RegistrationError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userVerification WHERE email = ? AND verificationCode = ?)",
        List(
          SqlParameter("String", userEmail),
          SqlParameter("String", verificationCode)
        )
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(RegisterError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  case class RegisterAuditorRequest(
      userName: String,
      userEmail: String,
      password: String
  ) extends API[String](auditorServiceCode)

  val registerAuditorRequest: RegisterAuditorRequest =
    RegisterAuditorRequest(userName, userEmail, password)

  case class RegisterReaderRequest(
      userName: String,
      userEmail: String,
      password: String
  ) extends API[String](readerServiceCode)

  val registerReaderRequest: RegisterReaderRequest =
    RegisterReaderRequest(userName, userEmail, password)

  case class RegisterWriterRequest(
      userName: String,
      userEmail: String,
      password: String
  ) extends API[String](writerServiceCode)

  val registerWriterRequest: RegisterWriterRequest =
    RegisterWriterRequest(userName, userEmail, password)

  private def registerUser(implicit
      planContext: PlanContext
  ): EitherT[IO, RegistrationError, String] = {
    val hashedPassword = PasswordUtils.hashPassword(password)
    EitherT {
      writeDB(
        s"INSERT INTO ${schemaName}.userInfo (email, userName, password, userToken, tokenExpire, userType, isDeleted) VALUES (?, ?, ?, '', '', ?, FALSE)",
        List(
          SqlParameter("String", userEmail),
          SqlParameter("String", userName),
          SqlParameter("String", hashedPassword),
          SqlParameter("Int", userType.toString)
        )
      ).attempt.flatMap {
        case Right(_) =>
          userType match {
            case 1 =>
              registerReaderRequest.send.map { case _ =>
                Right("Registration successful")
              }
            case 2 =>
              registerWriterRequest.send.map { case _ =>
                Right("Registration successful")
              }
            case 3 =>
              registerAuditorRequest.send.map { case _ =>
                Right("Registration successful")
              }
            case _ =>
              IO.pure(Right("Success"))
          }
        case Left(e) => IO.pure(Left(RegisterError.SystemError(e.getMessage)))
      }
    }
  }

  override def plan(implicit
      planContext: PlanContext
  ): IO[Either[RegistrationError, String]] = {
    val registrationProcess = for {
      userExists <- checkUserExists.leftMap(identity)
      _ <-
        if (userExists)
          EitherT.leftT[IO, RegistrationError](
            RegisterError.UserAlreadyRegistered(
              s"User '$userName' already exists"
            )
          )
        else EitherT.rightT[IO, RegistrationError](())
      emailExists <- checkEmailExists.leftMap(identity)
      _ <-
        if (emailExists)
          EitherT.leftT[IO, RegistrationError](
            RegisterError.EmailAlreadyRegistered(
              s"Email '$userEmail' already exists"
            )
          )
        else EitherT.rightT[IO, RegistrationError](())
      verificationSucceeded <- checkVerificationCode.leftMap(identity)
      _ <-
        if (!verificationSucceeded)
          EitherT.leftT[IO, RegistrationError](
            RegisterError.VerificationFailed()
          )
        else EitherT.rightT[IO, RegistrationError](())
      result <- registerUser.leftMap(identity)
    } yield result

    registrationProcess.value
  }
}
