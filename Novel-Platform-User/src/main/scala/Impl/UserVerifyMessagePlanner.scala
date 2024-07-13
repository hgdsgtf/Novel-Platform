package Impl

import cats.effect.IO
import cats.data.EitherT
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

sealed trait VerificationError extends Exception {
  def message: String
}

object VerificationError {
  case class VerificationFailed(message: String = "Verification failed")
      extends VerificationError
  case class EmailNotExist(message: String = "Email doesn't exist")
      extends VerificationError
  case class SystemError(message: String = "System error")
      extends VerificationError
}

case class UserVerifyMessagePlanner(
    userEmail: String,
    verificationCode: String,
    override val planContext: PlanContext
) extends Planner[Either[VerificationError, String]] {

  private def checkVerificationCode(implicit
      planContext: PlanContext
  ): EitherT[IO, VerificationError, Boolean] =
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
          Left(VerificationError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  private def checkEmailExists(implicit
      planContext: PlanContext
  ): EitherT[IO, VerificationError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE email = ?)",
        List(SqlParameter("String", userEmail))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(VerificationError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  override def plan(implicit
      planContext: PlanContext
  ): IO[Either[VerificationError, String]] = {
    val verificationProcess: EitherT[IO, VerificationError, String] = for {
      verification <- checkVerificationCode.leftMap(identity)
      _ <- EitherT[IO, VerificationError, Unit](
        if (!verification)
          IO.pure(Left(VerificationError.VerificationFailed()))
        else IO.pure(Right(()))
      )
      emailExists <- checkEmailExists.leftMap(identity)
      _ <- EitherT[IO, VerificationError, Unit](
        if (!emailExists)
          IO.pure(
            Left(
              VerificationError.EmailNotExist(
                s"Email '${userEmail}' doesn't exist"
              )
            )
          )
        else IO.pure(Right(()))
      )
    } yield "Verification succeeded"

    verificationProcess.value
  }
}
