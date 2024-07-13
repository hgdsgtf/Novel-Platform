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
  def init(config: ServerConfig): IO[Unit] = {
    given PlanContext =
      PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)
    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.homepage (
           |  id SERIAL PRIMARY KEY,
           |  stylename TEXT,
           |  buttoncolor TEXT,
           |  buttonfontsize REAL,
           |  buttonwidth INTEGER,
           |  paragraphfontsize REAL,
           |  paragraphcolor TEXT,
           |  headerfontsize REAL,
           |  headercolor TEXT
           |);
           |
           |INSERT INTO ${schemaName}.homepage (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES ('defaultstyle', '#8eaaff', 1.8, 110, 1.8, '#646464', 3.0, '#9081f1')
           |ON CONFLICT DO NOTHING;
        """.stripMargin, List()
      )
    } yield ()
  }
}

