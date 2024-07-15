package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.Json

case class SearchNovelMessagePlanner(
    title: String,
    override val planContext: PlanContext
) extends Planner[List[Json]] {
  def calculateCommonCharacterCount(input: String, title: String): Int = {
    val inputLower = input.toLowerCase
    val titleLower = title.toLowerCase
    def commonCharacterCountRecursive(i: Int, j: Int, count: Int): Int = {
      if (i >= inputLower.length || j >= titleLower.length) count
      else if (inputLower(i) == titleLower(j))
        commonCharacterCountRecursive(i + 1, j + 1, count + 1)
      else
        math.max(
          commonCharacterCountRecursive(i + 1, j, count),
          commonCharacterCountRecursive(i, j + 1, count)
        )
    }
    commonCharacterCountRecursive(0, 0, 0)
  }

  def searchNovels(
      title: String
  )(using planContext: PlanContext): IO[List[Json]] = {
    for {
      titlesJson <- readDBRows(
        s"SELECT title FROM ${schemaName}.novel",
        List()
      )
      titles = titlesJson.flatMap { json =>
        json.hcursor.downField("title").as[String].toOption
      }
      titlesWithScores = titles.map(novel =>
        (novel, calculateCommonCharacterCount(title, novel))
      )
      sortedTitles = titlesWithScores.filter(_._2 > 0).sortBy(-_._2).take(10)
      jsonResults = sortedTitles.map { case (novelTitle, score) =>
        Json.obj(
          "title" -> Json.fromString(novelTitle),
          "score" -> Json.fromInt(score)
        )
      }
    } yield jsonResults
  }

  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    searchNovels(title)
  }
}
