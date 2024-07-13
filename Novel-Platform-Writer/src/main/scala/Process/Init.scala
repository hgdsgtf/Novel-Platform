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
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.writeremail_writerverificationcode (writeremail TEXT, writerverificationcode TEXT)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.writeremail_writeruser_writerpassword_writerbook (writeremail TEXT, writeruser TEXT, writerpassword TEXT, writerbook TEXT[])",
        List()
      )
    } yield ()
}
