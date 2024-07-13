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
  def init(config: ServerConfig): IO[Unit] =
    given PlanContext =
      PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)
    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.readeremail_readerverificationcode (readeremail TEXT, readerverificationcode TEXT)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney (readeremail TEXT, readeruser TEXT, readerpassword TEXT, readerbook TEXT[], readermoney INT)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.readeruser_readerbook_readeroldchapters ( readeruser TEXT,  readerbook TEXT, readeroldchapters INT[])",
        List()
      )
    } yield ()
}
