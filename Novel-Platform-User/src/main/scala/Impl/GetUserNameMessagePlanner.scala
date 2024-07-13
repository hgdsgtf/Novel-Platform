package Impl

import cats.effect.IO
import cats.data.EitherT
import cats.implicits._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

sealed trait GetUserNameError extends Exception {
  def message: String
}

object GetUserNameError {
  case class EmailNotExist(message: String = "Email doesn't exist")
      extends GetUserNameError
  case class SystemError(message: String = "System error")
      extends GetUserNameError
}

case class GetUserNameMessagePlanner(
    userEmail: String,
    override val planContext: PlanContext
) extends Planner[Either[GetUserNameError, String]] {

  private def checkEmailExists(implicit
      planContext: PlanContext
  ): EitherT[IO, GetUserNameError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE email = ?)",
        List(SqlParameter("String", userEmail))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(GetUserNameError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  private def getUserName(implicit
      planContext: PlanContext
  ): EitherT[IO, GetUserNameError, String] =
    EitherT {
      readDBString(
        s"SELECT userName FROM ${schemaName}.userInfo WHERE email = ?",
        List(SqlParameter("String", userEmail))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(GetUserNameError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  override def plan(implicit
      planContext: PlanContext
  ): IO[Either[GetUserNameError, String]] = {
    val process = for {
      emailExists <- checkEmailExists.leftMap(identity)
      _ <-
        if (!emailExists)
          EitherT.leftT[IO, GetUserNameError](
            GetUserNameError.EmailNotExist(
              s"Email '${userEmail}' doesn't exist"
            )
          )
        else EitherT.rightT[IO, GetUserNameError](())
      userName <- getUserName.leftMap(identity)
    } yield userName

    process.value
  }
}
