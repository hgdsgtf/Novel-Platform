package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class PurchaseMessagePlanner(
    userName: String,
    title: String,
    chapter: Int,
    cost: Int,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    val addReader = writeDB(
      s"UPDATE novel.novel SET reader = reader || ? WHERE chapter = ${chapter} AND title = ?",
      List(SqlParameter("String", userName), SqlParameter("String", title))
    )
    val checkBalance = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readermoney >= ${cost} AND readeruser = ?)",
      List(SqlParameter("String", userName))
    )
    val updateBalance = writeDB(
      s"UPDATE ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney SET readermoney = readermoney - ${cost} WHERE readeruser = ?",
      List(SqlParameter("String", userName))
    )
    try {
      checkBalance.flatMap { success =>
        if (success) {
          addReader.flatMap { _ =>
            updateBalance
          }
        } else {
          IO.raiseError(new Exception("Not enough money left"))
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
