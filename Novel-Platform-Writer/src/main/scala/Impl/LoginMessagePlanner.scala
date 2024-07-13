package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{writeDB, *}
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class LoginMessagePlanner(
    userName: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      val checkUserExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ?)",
        List(SqlParameter("String", userName))
      )
      val checkHasPermission = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ? AND writerpassword = ?)",
        List(SqlParameter("String", userName), SqlParameter("String", password))
      )
      checkUserExists.flatMap { userExists =>
        if (!userExists) {
          IO.raiseError(new Exception("User does not exist"))
        } else {
          checkHasPermission.flatMap { hasPermission =>
            if (hasPermission) {
              IO.pure("Logged in successfully")
            } else {
              IO.raiseError(new Exception("Incorrect password"))
            }
          }
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
