package Impl

import cats.effect.IO
import cats.data.EitherT
import cats.implicits._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

sealed trait GetUserTypeError extends Exception {
  def message: String
}

object GetUserTypeError {
  case class TokenNotExist(message: String = "Token doesn't exist")
      extends GetUserTypeError
  case class SystemError(message: String = "System error")
      extends GetUserTypeError
}

case class GetUserTypeByTokenMessagePlanner(
    userToken: String,
    override val planContext: PlanContext
) extends Planner[Either[GetUserTypeError, Int]] {

  private def checkUserTokenExists(implicit
      planContext: PlanContext
  ): EitherT[IO, GetUserTypeError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE userToken = ?)",
        List(SqlParameter("String", userToken))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(GetUserTypeError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  private def getUserName(implicit
      planContext: PlanContext
  ): EitherT[IO, GetUserTypeError, Int] =
    EitherT {
      readDBInt(
        s"SELECT userType FROM ${schemaName}.userInfo WHERE userToken = ?",
        List(SqlParameter("String", userToken))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(GetUserTypeError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  override def plan(implicit
      planContext: PlanContext
  ): IO[Either[GetUserTypeError, Int]] = {
    val process = for {
      emailExists <- checkUserTokenExists.leftMap(identity)
      _ <-
        if (!emailExists)
          EitherT.leftT[IO, GetUserTypeError](
            GetUserTypeError.TokenNotExist()
          )
        else EitherT.rightT[IO, GetUserTypeError](())
      userName <- getUserName.leftMap(identity)
    } yield userName

    process.value
  }
}
