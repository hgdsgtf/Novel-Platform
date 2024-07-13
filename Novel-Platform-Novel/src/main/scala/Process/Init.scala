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
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.novel (title TEXT, author TEXT, chapter INT, chaptername TEXT, price INT, content TEXT, filteredcontent TEXT, status INT, reader TEXT[], issues TEXT[], writerreason TEXT, auditorcomment TEXT)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.novelInfo (title TEXT, author TEXT, summary TEXT DEFAULT '', rating DOUBLE PRECISION DEFAULT 0.0, ratings INTEGER[] DEFAULT '{}')",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.chapter_rating (title TEXT, chapter INT, ratings INTEGER[], rating DOUBLE PRECISION)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.reader_chapter_ratings ( chapter_id INT, rating INT, readername TEXT, noveltitle TEXT)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.reader_novel_ratings ( rating INT, readername TEXT, novelname TEXT)",
        List()
      )
    } yield ()
}
