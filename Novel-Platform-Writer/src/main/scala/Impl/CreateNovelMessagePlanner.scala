package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{API, PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import Global.ServiceCenter.novelServiceCode

case class CreateNovelMessagePlanner(
    userName: String,
    title: String,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    try {
      val checkNovelExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ? AND ? = ANY(writerbook))", // 确保表名和列名是正确的
        List(SqlParameter("String", userName), SqlParameter("String", title))
      )
      case class RegisterNovelRequest(title: String, author: String)
          extends API[String](novelServiceCode)
      val registerNovelRequest = RegisterNovelRequest(title, userName)
      checkNovelExists.flatMap { exists =>
        if (exists) {
          IO.raiseError(new Exception("Novel title already exist"))
        } else {
          writeDB(
            s"UPDATE ${schemaName}.writeremail_writeruser_writerpassword_writerbook SET writerbook = writerbook || ? WHERE writeruser = ?",
            List(
              SqlParameter("String", title),
              SqlParameter("String", userName)
            )
          ).flatMap { _ =>
            registerNovelRequest.send
          }
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
