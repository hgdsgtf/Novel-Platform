package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import Common.Object.SqlParameter

case class GetAllStylesMessagePlanner(
                                       override val planContext: PlanContext,
                                       pageName: String
                                     ) extends Planner[List[Json]] {
  override def plan(using PlanContext): IO[List[Json]] = {
    try {
      val query = s"SELECT id, stylename FROM ${schemaName}.$pageName"
      readDBRows(query, List()).map { result =>
        result.map { row =>
          val id = row.hcursor.downField("id").as[Int].getOrElse(0)
          val styleName = row.hcursor.downField("stylename").as[String].getOrElse("")
          Json.obj(
            ("id", Json.fromInt(id)),
            ("styleName", Json.fromString(styleName))
          )
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
