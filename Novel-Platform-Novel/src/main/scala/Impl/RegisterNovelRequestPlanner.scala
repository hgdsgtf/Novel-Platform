package Impl

import APIs.NovelInfo
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{decodeType, readDBBoolean, readDBRows, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, HCursor}

import scala.util.{Failure, Success, Try}

case class RegisterNovelRequestPlanner(
    title: String,
    author: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      writeDB(
        s"INSERT INTO ${schemaName}.novelInfo (title, author) VALUES (?, ?)",
        List(SqlParameter("String", title), SqlParameter("String", author))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
