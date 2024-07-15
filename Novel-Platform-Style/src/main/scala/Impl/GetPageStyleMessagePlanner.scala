package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._

case class GetPageStyleMessagePlanner(
                                       pageName: String,
                                       styleId: Int,
                                       override val planContext: PlanContext
                                     ) extends Planner[List[Json]] {
  override def plan(using PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT * FROM ${schemaName}.$pageName WHERE id = ?",
        List(SqlParameter("Int", styleId.toString))
      ).map { result =>
        result.map { row =>
          val id = row.hcursor.downField("id").as[Int].getOrElse(0)
          val styleName = row.hcursor.downField("stylename").as[String].getOrElse("")
          val buttonColor = row.hcursor.downField("buttoncolor").as[String].getOrElse("")
          val buttonFontSize = row.hcursor.downField("buttonfontsize").as[Double].getOrElse(1.0)
          val buttonWidth = row.hcursor.downField("buttonwidth").as[Double].getOrElse(100.0)
          val paragraphFontSize = row.hcursor.downField("paragraphfontsize").as[Double].getOrElse(1.0)
          val paragraphColor = row.hcursor.downField("paragraphcolor").as[String].getOrElse("")
          val headerFontSize = row.hcursor.downField("headerfontsize").as[Double].getOrElse(1.5)
          val headerColor = row.hcursor.downField("headercolor").as[String].getOrElse("")

          // 创建一个包含样式信息的JSON对象
          Json.obj(
            ("id", Json.fromInt(id)),
            ("styleName", Json.fromString(styleName)),
            ("buttonColor", Json.fromString(buttonColor)),
            ("buttonFontSize", Json.fromDoubleOrString(buttonFontSize)),
            ("buttonWidth", Json.fromDoubleOrString(buttonWidth)),
            ("paragraphFontSize", Json.fromDoubleOrString(paragraphFontSize)),
            ("paragraphColor", Json.fromString(paragraphColor)),
            ("headerFontSize", Json.fromDoubleOrString(headerFontSize)),
            ("headerColor", Json.fromString(headerColor))
          )
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
