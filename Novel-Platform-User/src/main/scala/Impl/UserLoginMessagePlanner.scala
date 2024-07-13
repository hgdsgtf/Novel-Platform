package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.PasswordUtils
import Common.ServiceUtils.schemaName

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import scala.util.Random

sealed trait LoginError extends Exception {
  def message: String
}

object LoginError {
  case class UserNotExistError(message: String = "User does not exist")
      extends LoginError

  case class IncorrectPasswordError(message: String = "Incorrect password")
      extends LoginError

  case class SystemError(message: String = "System error") extends LoginError
}

case class UserLoginMessagePlanner(
    userName: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[Either[LoginError, String]] { // 返回 Either 类型，包含错误或者成功的结果

  private def generateUniqueToken(using
      planContext: PlanContext
  ): IO[String] = {
    val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    val random = new Random
    def generateToken: String =
      (1 to 20).map(_ => chars(random.nextInt(chars.length))).mkString

    def checkTokenUnique(token: String): IO[Boolean] = {
      readDBBoolean(
        s"SELECT NOT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE userToken = ?)",
        List(SqlParameter("String", token))
      )
    }

    def generateAndCheck(using planContext: PlanContext): IO[String] = {
      val token = generateToken
      checkTokenUnique(token).flatMap { isUnique =>
        if (isUnique) IO.pure(token) else generateAndCheck
      }
    }

    generateAndCheck(using planContext)
  }

  override def plan(using
      planContext: PlanContext
  ): IO[Either[LoginError, String]] = {
    val checkUserExists = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE userName = ?)",
      List(SqlParameter("String", userName))
    )

    val checkHasPermission = readDBString(
      s"SELECT password FROM ${schemaName}.userInfo WHERE userName = ?",
      List(SqlParameter("String", userName))
    ).map(result => {
      PasswordUtils.checkPassword(password, result)
    })

    checkUserExists
      .flatMap { userExists =>
        if (!userExists) {
          IO.pure(
            Left(
              LoginError.UserNotExistError(s"User '$userName' does not exist")
            )
          )
        } else {
          checkHasPermission.flatMap { hasPermission =>
            if (hasPermission) {
              generateUniqueToken.flatMap { userToken =>
                val expireTime = LocalDateTime
                  .now()
                  .plusHours(2)
                  .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

                writeDB(
                  s"UPDATE ${schemaName}.userInfo SET userToken = ?, tokenExpire = ? WHERE userName = ?",
                  List(
                    SqlParameter("String", userToken),
                    SqlParameter("String", expireTime),
                    SqlParameter("String", userName)
                  )
                ).map { _ =>
                  Right(userToken)
                }
              }
            } else {
              IO.pure(
                Left(LoginError.IncorrectPasswordError("Incorrect password"))
              )
            }
          }
        }
      }
      .handleErrorWith {
        case e: LoginError => IO.pure(Left(e))
        case e: Exception =>
          IO.pure(
            Left(LoginError.SystemError(s"System error: ${e.getMessage}"))
          )
      }
  }
}
