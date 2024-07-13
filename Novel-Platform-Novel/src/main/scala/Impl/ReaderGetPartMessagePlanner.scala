package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class ReaderGetPartMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      // Check if the  title already exists
      readDBString(
        s"SELECT CASE WHEN LENGTH(content) > 20 THEN SUBSTRING(filteredcontent, 1, 10) ELSE SUBSTRING(filteredcontent, 1, (LENGTH(content) / 2)::integer) END FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter}",
        List(SqlParameter("String", title))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
