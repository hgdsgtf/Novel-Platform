package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.parser.decode
import APIs.NovelsRanking

case class NovelsRankingPlanner(override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = s"SELECT title, rating FROM ${schemaName}.novelinfo"
    val params = List.empty[SqlParameter]

    readDBRows(query, params).flatMap { result =>
      val novels = result.flatMap { row =>
        val cursor = row.hcursor
        for {
          title <- cursor.get[String]("title").toOption
          rating <- cursor.get[Double]("rating").toOption
        } yield NovelsRanking(title, rating)
      }

      val sortedNovels = novels.sortBy(novel => Option(-novel.rating).getOrElse(Double.MinValue))

      if (sortedNovels.nonEmpty) {
        IO.pure(sortedNovels.asJson.noSpaces)
      } else {
        IO.raiseError(new Exception("未找到相关书籍"))
      }
    }.handleErrorWith { error =>
      IO.raiseError(new Exception(s"获取书籍信息失败: ${error.getMessage}"))
    }
  }
}
