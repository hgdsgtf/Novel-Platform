package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBInt, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class GetChapterPriceMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[Int] {

  override def plan(using planContext: PlanContext): IO[Int] = {
    try {
      // Check if the title and chapter already exist and fetch the content
      readDBInt(
        s"SELECT price FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter}",
        List(SqlParameter("String", title))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
