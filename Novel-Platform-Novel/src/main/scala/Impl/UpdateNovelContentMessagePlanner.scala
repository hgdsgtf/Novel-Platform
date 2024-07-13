package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UpdateNovelContentMessagePlanner(
    title: String,
    chapter: Int,
    newContent: String,
    reason: String,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    try {
      val checkTitleExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter})",
        List(SqlParameter("String", title))
      )
      val price = newContent.length / 10
      checkTitleExists.flatMap { exists =>
        if (exists) {
          writeDB(
            s"UPDATE ${schemaName}.novel SET content = ?, filteredcontent = ?, price = ${price}, status = 0, writerreason = ?, auditorcomment = '' WHERE title = ? AND chapter = ${chapter}",
            List(
              SqlParameter("String", newContent),
              SqlParameter("String", newContent),
              SqlParameter("String", reason),
              SqlParameter("String", title)
            )
          ).map { _ =>
            "Novel content updated successfully"
          }
        } else {
          IO.raiseError(new Exception("Chapter doesn't exist"))
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
