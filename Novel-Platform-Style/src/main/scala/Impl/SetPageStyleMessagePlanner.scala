package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._

case class SetPageStyleMessagePlanner(
                                       pageName: String,
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
      val query = s"INSERT INTO ${schemaName}.$pageName (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor) VALUES (?, ?, ${buttonfontsize}, ?, ${paragraphfontsize}, ?, ${headerfontsize}, ?)"
      writeDB(
        query,
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
