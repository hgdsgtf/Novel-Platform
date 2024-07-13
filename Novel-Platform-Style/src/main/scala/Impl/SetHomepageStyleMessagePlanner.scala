package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class SetHomepageStyleMessagePlanner(
    stylename: String,
    buttoncolor: String,
    buttonfontsize: Float,
    buttonwidth: Int,
    paragraphfontsize: Float,
    paragraphcolor: String,
    headerfontsize: Float,
    headercolor: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    try {
      writeDB(
        s"INSERT INTO ${schemaName}.homepage (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor) VALUES (?, ?, ${buttonfontsize}, ?, ${paragraphfontsize}, ?, ${headerfontsize}, ?)",
        List(
          SqlParameter("String", stylename),
          SqlParameter("String", buttoncolor),
          SqlParameter("Int", buttonwidth.toString),
          SqlParameter("String", paragraphcolor),
          SqlParameter("String", headercolor)
        )
      ).map { _ => "Added successfully" }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
