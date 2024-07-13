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
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.comment (content TEXT NOT NULL, likes INTEGER NOT NULL DEFAULT 0, title TEXT NOT NULL, username TEXT NOT NULL, id SERIAL PRIMARY KEY, parentusername TEXT, parentcommentid INTEGER, createdat TEXT NOT NULL, usertype TEXT, chapterid INTEGER, isauthorcomment TEXT, liker JSONB[] DEFAULT '{}')", List())
    } yield ()

}
