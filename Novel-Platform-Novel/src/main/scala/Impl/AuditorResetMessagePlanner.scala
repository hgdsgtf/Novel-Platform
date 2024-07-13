package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class AuditorResetMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    try {
      writeDB(
        s"UPDATE ${schemaName}.novel SET filteredcontent = content WHERE title = ? AND chapter = ${chapter}",
        List(
          SqlParameter("String", title)
        )
      ).map(_ => "Modified successfully")
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
