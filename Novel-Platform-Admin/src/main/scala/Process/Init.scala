package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config:ServerConfig):IO[Unit]=
    given PlanContext=PlanContext(traceID = TraceID(UUID.randomUUID().toString),0)
    for{
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.adminemail_adminverificationcode (adminemail TEXT, adminverificationcode TEXT)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.adminemail_adminuser_adminpassword_adminbook (adminemail TEXT, adminuser TEXT, adminpassword TEXT, adminbook TEXT[])", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.readername_noveltitle_clicks_lastclicktime (readername TEXT, noveltitle TEXT, clicks INT, lastclicktime TIMESTAMP)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.noveltitle_date_clicks (noveltitle TEXT, date INT, clicks INT)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.writer_date_clicks (writer TEXT, date INT, clicks INT)", List())
    } yield ()
}
