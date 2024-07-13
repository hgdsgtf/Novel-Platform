package Impl

import Common.API.{API, PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import Global.ServiceCenter.novelServiceCode
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import org.http4s.*
import org.http4s.circe.*
import org.http4s.dsl.io.*

case class PurchaseMessagePlanner(
                                   userName: String,
                                   title: String,
                                   chapter: Int,
                                   cost: Int,
                                   override val planContext: PlanContext
                                 ) extends Planner[String] {

  override def plan(using PlanContext): IO[String] = {
    val checkBalance = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readermoney >= ${cost} AND readeruser = ?)",
      List(SqlParameter("String", userName))
    )
    val updateBalance = writeDB(
      s"UPDATE ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney SET readermoney = readermoney - ${cost} WHERE readeruser = ?",
      List(SqlParameter("String", userName))
    )

    case class AddReaderRequest(userName: String, title: String, chapter: Int) extends API[String](novelServiceCode)

    val addReaderRequest = AddReaderRequest(userName, title, chapter)

    try {
      checkBalance.flatMap { success =>
        if (success) {
          addReaderRequest.send.flatMap { response =>
            updateBalance.map(_ => response)
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


