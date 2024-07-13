package Impl

import Common.API.{PlanContext, Planner}
import cats.effect.IO
import io.circe.generic.auto.*

import java.time.ZonedDateTime
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

import java.time.format.DateTimeFormatter

import Common.API.GetAuthorMessage

case class UpdateClicksByDatePlanner(novelTitle: String, currentTime: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      // Check if the entry exists for the reader and novel title
      val currentTimeParsed = ZonedDateTime.parse(currentTime).toLocalDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"))
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.noveltitle_date_clicks WHERE noveltitle = ? AND date = ?)",
        List(
          SqlParameter("String", novelTitle),
          SqlParameter("Int", currentTimeParsed)
        )
      ).flatMap { exists =>
        if (exists) {
          // Update clicks and last click time
          writeDB(
            s"UPDATE ${schemaName}.noveltitle_date_clicks SET clicks = clicks + 1 WHERE noveltitle = ? AND date = ?",
            List(
              SqlParameter("String", novelTitle),
              SqlParameter("Int", currentTimeParsed)
            )
          ).map(_ => "Clicks updated successfully")
        } else {
          // Insert a new entry
          writeDB(
            s"INSERT INTO ${schemaName}.noveltitle_date_clicks (noveltitle, date, clicks) VALUES (?, ?, 1)",
            List(
              SqlParameter("String", novelTitle),
              SqlParameter("Int", currentTimeParsed)
            )
          ).map(_ => "New entry inserted successfully")
        }
      }.flatMap { _ =>
        // Call GetAuthorMessage API
        GetAuthorMessage(novelTitle).send.flatMap { author =>
          // Update writer_date_clicks table with author information
          readDBBoolean(
            s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writer_date_clicks WHERE writer = ? AND date = ?)",
            List(
              SqlParameter("String", author),
              SqlParameter("Int", currentTimeParsed)
            )
          ).flatMap{ exists =>
            if (exists) {
              writeDB(
                s"UPDATE ${schemaName}.writer_date_clicks SET clicks = clicks + 1 WHERE writer = ? AND date = ?",
                List(
                  SqlParameter("String", author),
                  SqlParameter("Int", currentTimeParsed)
                )
              ).map(_ => "Clicks updated and author information updated successfully")
            } else {
              // Insert into writer_date_clicks table with author information
              writeDB(
                s"INSERT INTO ${schemaName}.writer_date_clicks (writer, date, clicks) VALUES (?, ?, 1)",
                List(
                  SqlParameter("String", author),
                  SqlParameter("Int", currentTimeParsed),
                )
              )
            }.map(_ => "New entry inserted and author information inserted successfully")
          }
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("Database operation failed"))
    }
  }
}
