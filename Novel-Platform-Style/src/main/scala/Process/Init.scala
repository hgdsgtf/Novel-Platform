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
        """.stripMargin, List())
      // 创建 NovelComment 表
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.NovelComments (
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
           |INSERT INTO ${schemaName}.NovelComments (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.1, 100,  1.8, '#000000', 2.5, '#9081f1')
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )

      // 创建 CommentItem 表
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.CommentItem (
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
           |INSERT INTO ${schemaName}.CommentItem (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.0, 100, 1.6, '#000000', 2.5, '#9081f1')
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )

      // 创建 NovelInfo 表
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.NovelInfo (
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
           |INSERT INTO ${schemaName}.NovelInfo (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.8, 100, 1.0, '#000000', 2.5, '#000000');
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )

      // 创建 WriterNovelInfo 表
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.WriterNovelInfo (
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
           |INSERT INTO ${schemaName}.WriterNovelInfo (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.6,30, 1.8, '#646464', 2.5, '#9081f1')
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )

      // 创建 WriterReadNovel 表
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.WriterReadNovel (
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
           |INSERT INTO ${schemaName}.WriterReadNovel (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.1, 100,  1.0, '#000000', 2.0, '#9081f1')
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )

      // 创建 ReaderReadNovel 表
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.ReaderReadNovel (
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
           |INSERT INTO ${schemaName}.ReaderReadNovel (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.6, 100, 1.8, '#646464', 2.0, '#9081f1');
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS ${schemaName}.AuditorViewNovel (
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
           |INSERT INTO ${schemaName}.AuditorViewNovel  (stylename, buttoncolor, buttonfontsize, buttonwidth, paragraphfontsize, paragraphcolor, headerfontsize, headercolor)
           |VALUES
           |('defaultstyle', '#8eaaff', 1.6, 100, 1.8, '#646464', 2.5, '#9081f1');
           |ON CONFLICT DO NOTHING;
     """.stripMargin, List()
      )



    } yield ()
  }
}
