package Impl

import cats.effect.IO
import cats.data.EitherT
import cats.implicits._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

sealed trait GetUserIDError extends Exception {
  def message: String
}

object GetUserIDError {
  case class TokenNotExist(message: String = "Token doesn't exist")
      extends GetUserIDError
  case class SystemError(message: String = "System error")
      extends GetUserIDError
}

case class GetUserIDByTokenMessagePlanner(
    userToken: String,
    override val planContext: PlanContext
) extends Planner[Either[GetUserIDError, Int]] {

  private def checkUserTokenExists(implicit
      planContext: PlanContext
  ): EitherT[IO, GetUserIDError, Boolean] =
    EitherT {
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE userToken = ?)",
        List(SqlParameter("String", userToken))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(GetUserIDError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  private def getUserName(implicit
      planContext: PlanContext
  ): EitherT[IO, GetUserIDError, Int] =
    EitherT {
      readDBInt(
        s"SELECT userType FROM ${schemaName}.userInfo WHERE userToken = ?",
        List(SqlParameter("String", userToken))
      ).attempt.map {
        case Right(result) => Right(result)
        case Left(e) =>
          Left(GetUserIDError.SystemError(s"System error: ${e.getMessage}"))
      }
    }

  override def plan(implicit
      planContext: PlanContext
  ): IO[Either[GetUserIDError, Int]] = {
    val process = for {
      emailExists <- checkUserTokenExists.leftMap(identity)
      _ <-
        if (!emailExists)
          EitherT.leftT[IO, GetUserIDError](
            GetUserIDError.TokenNotExist()
          )
        else EitherT.rightT[IO, GetUserIDError](())
      userName <- getUserName.leftMap(identity)
    } yield userName

    process.value
  }
}
