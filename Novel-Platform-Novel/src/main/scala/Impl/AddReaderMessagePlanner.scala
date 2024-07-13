package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{decodeType, readDBRows, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import io.circe.syntax.*

case class AddReaderMessage(
                             userName: String,
                             title: String,
                             chapter: Int,
                             override val planContext: PlanContext
                           ) extends Planner[String] {

  override def plan(using PlanContext): IO[String] = {
    val addReader = writeDB(
      s"UPDATE ${schemaName}.novel SET reader = reader || ? WHERE chapter = ${chapter} AND title = ?",
      List(SqlParameter("String", userName), SqlParameter("String", title))
    )
    try {
      addReader.map(_ => "Reader added successfully")
    } catch {
      case e: Exception => IO.raiseError(new Exception("Failed to add reader"))
    }
  }
}
