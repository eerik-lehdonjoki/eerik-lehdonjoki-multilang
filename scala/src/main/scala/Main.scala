package users

import scala.io.Source
import java.nio.file.{Paths, Path}
import scala.util.Using

/** Simple representation of a user row. All fields stored as Strings for parity with other languages */
case class UserRecord(name: String, age: String, country: String)

object Main:
  // When running via `sbt run` inside the `scala/` directory, repo root is parent of this directory.
  private val CsvPath: Path = Paths.get("..", "users.csv")

  def loadUsers(path: Path): List[UserRecord] =
    if !java.nio.file.Files.exists(path) then
      Console.err.println(s"Could not read CSV at $path")
      Nil
    else
      val raw = Using.resource(Source.fromFile(path.toFile, "utf-8"))(_.getLines().toList)
      raw match
        case Nil => Nil
        case headerLine :: dataLines =>
          val header = headerLine.split(',').map(_.trim)
          val idxName = header.indexOf("name")
          val idxAge = header.indexOf("age")
            // ... we expect these columns to exist
          val idxCountry = header.indexOf("country")
          dataLines.filter(_.nonEmpty).map: line =>
            val cols = line.split(',').map(_.trim)
            def col(i: Int) = if i >= 0 && i < cols.length then cols(i) else ""
            UserRecord(col(idxName), col(idxAge), col(idxCountry))

  def filterUsersByMinimumAge(users: List[UserRecord], threshold: Int = 30): List[UserRecord] =
    users.filter: u =>
      u.age.toIntOption.exists(_ >= threshold)

  def countUsersByCountry(users: List[UserRecord]): Map[String, Int] =
    users.groupBy(_.country).view.mapValues(_.size).toMap

  def calculateUsersAverageAge(users: List[UserRecord]): Double =
    val ages = users.flatMap(u => u.age.toIntOption)
    if ages.isEmpty then 0.0
    else
      val avg = ages.sum.toDouble / ages.size
      (math.round(avg * 10) / 10.0)

  def getTopNOldestUsers(users: List[UserRecord], n: Int = 3): List[UserRecord] =
    users.sortBy(u => -u.age.toIntOption.getOrElse(0)).take(n)

  def getRegionForCountry(country: String): String =
    country match
      case "Finland" | "Germany" | "France" | "UK" => "Europe"
      case "USA" | "Canada"                         => "North America"
      case "Brazil"                                  => "South America"
      case "India" | "Japan"                        => "Asia"
      case "Australia"                               => "Oceania"
      case _                                          => "Other"

  def usersByRegion(users: List[UserRecord]): Map[String, Int] =
    users.groupBy(u => getRegionForCountry(u.country)).view.mapValues(_.size).toMap

  private def logKeyValueLines(m: Map[String, Int]): Unit =
    m.foreach { case (k, v) => println(s"  $k: $v") }

  private def doSummary(users: List[UserRecord]): Unit =
    val total = users.size
    val filtered = filterUsersByMinimumAge(users)
    val grouped = countUsersByCountry(users)
    val avgAge = calculateUsersAverageAge(users)
    val oldest = getTopNOldestUsers(users, 3)
    val regionCounts = usersByRegion(users)

    println(s"Total users: $total")
    println(s"Filtered count: ${filtered.size}")
    println("Users per country:")
    logKeyValueLines(grouped)
    println(s"Average age: $avgAge")
    println("Top 3 oldest users:")
    oldest.foreach(u => println(s"  ${u.name} (${u.age})"))
    println("Users per region:")
    logKeyValueLines(regionCounts)

  def main(args: Array[String]): Unit =
    val users = loadUsers(CsvPath)
    if users.isEmpty then return

    val op = if args.nonEmpty then args(0) else "summary"
    if op == "summary" then
      doSummary(users)
      return
    if op == "filter" then
      println(s"Filtered count: ${filterUsersByMinimumAge(users).size}")
      return
    if op == "group" then
      println("Users per country:")
      logKeyValueLines(countUsersByCountry(users))
      return
    if op == "avg" then
      println(s"Average age: ${calculateUsersAverageAge(users)}")
      return
    if op == "top" then
      getTopNOldestUsers(users).foreach(u => println(s"${u.name} (${u.age})"))
      return
    if op == "region" then
      println("Users per region:")
      logKeyValueLines(usersByRegion(users))
      return
    println(s"Unknown operation '$op'. Use summary|filter|group|avg|top|region.")

