package Impl

import Common.API.{PlanContext, Planner}
import cats.effect.IO
import io.circe.generic.auto.*

import java.sql.Timestamp
import java.time.{Instant, ZonedDateTime}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class UpdateClicksPlanner(readerName: String, novelTitle: String, currentTime: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      // Check if the entry exists for the reader and novel title
      val currentTimeParsed = ZonedDateTime.parse(currentTime).toInstant.toEpochMilli.toString
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readername_noveltitle_clicks_lastclicktime WHERE readername = ? AND noveltitle = ?)",
        List(
          SqlParameter("String", readerName),
          SqlParameter("String", novelTitle)
        )
      ).flatMap { exists =>
        if (exists) {
          // Update clicks and last click time
          writeDB(
            s"UPDATE ${schemaName}.readername_noveltitle_clicks_lastclicktime SET clicks = clicks + 1, lastclicktime = ? WHERE readername = ? AND noveltitle = ?",
            List(
              SqlParameter("DateTime", currentTimeParsed),
              SqlParameter("String", readerName),
              SqlParameter("String", novelTitle)
            )
          ).map(_ => "Clicks updated successfully")
        } else {
          // Insert a new entry
          writeDB(
            s"INSERT INTO ${schemaName}.readername_noveltitle_clicks_lastclicktime (readername, noveltitle, clicks, lastclicktime) VALUES (?, ?, 1, ?)",
            List(
              SqlParameter("String", readerName),
              SqlParameter("String", novelTitle),
              SqlParameter("DateTime", currentTimeParsed)
            )
          ).map(_ => "New entry inserted successfully")
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("Database operation failed"))
    }
  }
}
