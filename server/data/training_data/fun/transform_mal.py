from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from typing import Union, Any, List, TypeVar, Type, Callable, cast, TypedDict
from pprint import pprint
import json
import dataclasses

T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_datetime(x: Any) -> datetime:
    return datetime.strptime(x, "%m/%d/%y %H:%M:%S")


def from_union(fs, x):
    for f in fs:
        try:
            return f(x)
        except:
            pass


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


class MyFinishDateEnum(Enum):
    THE_00000000 = "0000-00-00"


class MyPriority(Enum):
    LOW = "LOW"


class MySns(Enum):
    DEFAULT = "default"


class MyStatus(Enum):
    COMPLETED = "Completed"
    DROPPED = "Dropped"
    ON_HOLD = "On-Hold"
    PLAN_TO_WATCH = "Plan to Watch"
    WATCHING = "Watching"


class SeriesType(Enum):
    MOVIE = "Movie"
    MUSIC = "Music"
    ONA = "ONA"
    SPECIAL = "Special"
    TV = "TV"


@dataclass
class Anime:
    series_animedb_id: int
    series_title: str
    series_type: SeriesType
    series_episodes: int
    my_id: int
    my_watched_episodes: int
    my_start_date: Union[MyFinishDateEnum, datetime]
    my_finish_date: Union[MyFinishDateEnum, datetime]
    my_rated: str
    my_score: int
    my_storage: str
    my_storage_value: int
    my_status: MyStatus
    my_comments: str
    my_times_watched: int
    my_rewatch_value: str
    my_priority: MyPriority
    my_tags: str
    my_rewatching: int
    my_rewatching_ep: int
    my_discuss: int
    my_sns: MySns
    update_on_import: int

    @staticmethod
    def from_dict(obj: Any) -> 'Anime':
        assert isinstance(obj, dict)
        series_animedb_id = from_int(obj.get("series_animedb_id"))
        series_title = from_str(obj.get("series_title"))
        series_type = SeriesType(obj.get("series_type"))
        series_episodes = from_int(obj.get("series_episodes"))
        my_id = from_int(obj.get("my_id"))
        my_watched_episodes = from_int(obj.get("my_watched_episodes"))
        my_start_date = from_union([MyFinishDateEnum, from_datetime], obj.get("my_start_date"))
        my_finish_date = from_union([MyFinishDateEnum, from_datetime], obj.get("my_finish_date"))
        my_rated = from_str(obj.get("my_rated"))
        my_score = from_int(obj.get("my_score"))
        my_storage = from_str(obj.get("my_storage"))
        my_storage_value = from_int(obj.get("my_storage_value"))
        my_status = MyStatus(obj.get("my_status"))
        my_comments = from_str(obj.get("my_comments"))
        my_times_watched = from_int(obj.get("my_times_watched"))
        my_rewatch_value = from_str(obj.get("my_rewatch_value"))
        my_priority = MyPriority(obj.get("my_priority"))
        my_tags = from_str(obj.get("my_tags"))
        my_rewatching = from_int(obj.get("my_rewatching"))
        my_rewatching_ep = from_int(obj.get("my_rewatching_ep"))
        my_discuss = from_int(obj.get("my_discuss"))
        my_sns = MySns(obj.get("my_sns"))
        update_on_import = from_int(obj.get("update_on_import"))
        return Anime(series_animedb_id, series_title, series_type, series_episodes, my_id, my_watched_episodes, my_start_date, my_finish_date, my_rated, my_score, my_storage, my_storage_value, my_status, my_comments, my_times_watched, my_rewatch_value, my_priority, my_tags, my_rewatching, my_rewatching_ep, my_discuss, my_sns, update_on_import)

    def to_dict(self) -> dict:
        result: dict = {}
        result["series_animedb_id"] = from_int(self.series_animedb_id)
        result["series_title"] = from_str(self.series_title)
        result["series_type"] = to_enum(SeriesType, self.series_type)
        result["series_episodes"] = from_int(self.series_episodes)
        result["my_id"] = from_int(self.my_id)
        result["my_watched_episodes"] = from_int(self.my_watched_episodes)
        result["my_start_date"] = from_union([lambda x: to_enum(MyFinishDateEnum, x), lambda x: x.isoformat()], self.my_start_date)
        result["my_finish_date"] = from_union([lambda x: to_enum(MyFinishDateEnum, x), lambda x: x.isoformat()], self.my_finish_date)
        result["my_rated"] = from_str(self.my_rated)
        result["my_score"] = from_int(self.my_score)
        result["my_storage"] = from_str(self.my_storage)
        result["my_storage_value"] = from_int(self.my_storage_value)
        result["my_status"] = to_enum(MyStatus, self.my_status)
        result["my_comments"] = from_str(self.my_comments)
        result["my_times_watched"] = from_int(self.my_times_watched)
        result["my_rewatch_value"] = from_str(self.my_rewatch_value)
        result["my_priority"] = to_enum(MyPriority, self.my_priority)
        result["my_tags"] = from_str(self.my_tags)
        result["my_rewatching"] = from_int(self.my_rewatching)
        result["my_rewatching_ep"] = from_int(self.my_rewatching_ep)
        result["my_discuss"] = from_int(self.my_discuss)
        result["my_sns"] = to_enum(MySns, self.my_sns)
        result["update_on_import"] = from_int(self.update_on_import)
        return result


@dataclass
class Myinfo:
    user_id: int
    user_name: str
    user_export_type: int
    user_total_anime: int
    user_total_watching: int
    user_total_completed: int
    user_total_onhold: int
    user_total_dropped: int
    user_total_plantowatch: int

    @staticmethod
    def from_dict(obj: Any) -> 'Myinfo':
        assert isinstance(obj, dict)
        user_id = from_int(obj.get("user_id"))
        user_name = from_str(obj.get("user_name"))
        user_export_type = from_int(obj.get("user_export_type"))
        user_total_anime = from_int(obj.get("user_total_anime"))
        user_total_watching = from_int(obj.get("user_total_watching"))
        user_total_completed = from_int(obj.get("user_total_completed"))
        user_total_onhold = from_int(obj.get("user_total_onhold"))
        user_total_dropped = from_int(obj.get("user_total_dropped"))
        user_total_plantowatch = from_int(obj.get("user_total_plantowatch"))
        return Myinfo(user_id, user_name, user_export_type, user_total_anime, user_total_watching, user_total_completed, user_total_onhold, user_total_dropped, user_total_plantowatch)

    def to_dict(self) -> dict:
        result: dict = {}
        result["user_id"] = from_int(self.user_id)
        result["user_name"] = from_str(self.user_name)
        result["user_export_type"] = from_int(self.user_export_type)
        result["user_total_anime"] = from_int(self.user_total_anime)
        result["user_total_watching"] = from_int(self.user_total_watching)
        result["user_total_completed"] = from_int(self.user_total_completed)
        result["user_total_onhold"] = from_int(self.user_total_onhold)
        result["user_total_dropped"] = from_int(self.user_total_dropped)
        result["user_total_plantowatch"] = from_int(self.user_total_plantowatch)
        return result


@dataclass
class Myanimelist:
    myinfo: Myinfo
    anime: List[Anime]

    @staticmethod
    def from_dict(obj: Any) -> 'Myanimelist':
        assert isinstance(obj, dict)
        myinfo = Myinfo.from_dict(obj.get("myinfo"))
        anime = from_list(Anime.from_dict, obj.get("anime"))
        return Myanimelist(myinfo, anime)

    def to_dict(self) -> dict:
        result: dict = {}
        result["myinfo"] = to_class(Myinfo, self.myinfo)
        result["anime"] = from_list(lambda x: to_class(Anime, x), self.anime)
        return result


@dataclass
class MalDump:
    xml: str
    myanimelist: Myanimelist

    @staticmethod
    def from_dict(obj: Any) -> 'MalDump':
        assert isinstance(obj, dict)
        xml = from_str(obj.get("?xml"))
        myanimelist = Myanimelist.from_dict(obj.get("myanimelist"))
        return MalDump(xml, myanimelist)

    def to_dict(self) -> dict:
        result: dict = {}
        result["?xml"] = from_str(self.xml)
        result["myanimelist"] = to_class(Myanimelist, self.myanimelist)
        return result


def mal_dump_from_dict(s: Any) -> MalDump:
    return MalDump.from_dict(s)


def mal_dump_to_dict(x: MalDump) -> Any:
    return to_class(MalDump, x)


@dataclass
class TransformedMalUser:
    username: str
    total_anime_complete: int
    total_anime_watching: int
    total_anime_plan_to_watch: int
    total_anime_dropped: int
    total_anime_on_hold: int

@dataclass
class TransformedMalAnime:
    title: str
    show_type: str
    total_watched_episodes: int
    given_score: int
    watch_status: str


class TransformedMalData(TypedDict):
    user: TransformedMalUser
    anime: List[TransformedMalAnime]


class EnhancedJSONEncoder(json.JSONEncoder):
        def default(self, o):
            if dataclasses.is_dataclass(o):
                return dataclasses.asdict(o)
            return super().default(o)

if __name__ == "__main__":
    with open("./mal.json", "r", encoding="utf-8") as file:
        raw_data = json.loads(file.read())
        raw_mal_data = mal_dump_from_dict(raw_data)

    user_info = raw_mal_data.myanimelist.myinfo
    all_anime = raw_mal_data.myanimelist.anime

    transformed_user: TransformedMalUser = TransformedMalUser(username=user_info.user_name,
                                                              total_anime_complete=user_info.user_total_anime,
                                                              total_anime_watching=user_info.user_total_watching,
                                                              total_anime_dropped=user_info.user_total_dropped,
                                                              total_anime_on_hold=user_info.user_total_onhold,
                                                              total_anime_plan_to_watch=user_info.user_total_plantowatch
                                                                )
    transformed_animes: List[TransformedMalAnime] = []
    for anime in all_anime:
        transformed_anime: TransformedMalAnime = TransformedMalAnime(title=anime.series_title,
                                                                     show_type=anime.series_type.value,
                                                                    total_watched_episodes=anime.my_watched_episodes,
                                                                    given_score=anime.my_score,
                                                                    watch_status=anime.my_status.value)
        transformed_animes.append(transformed_anime)
    
    transformed_mal_data: TransformedMalData = {
        "user": transformed_user,
        "anime": transformed_animes
    }           

    transformed_user_dict = EnhancedJSONEncoder().default(transformed_user)
    transformed_animes_dict = [EnhancedJSONEncoder().default(transformed_anime) for transformed_anime in transformed_animes]
    
    user_str = "\n".join(f"{key}: {value}" for key, value in transformed_user_dict.items())
    anime_strs = ["\n".join(f"{key}: {value}" for key, value in transformed_anime.items()) for transformed_anime in transformed_animes_dict]
    strs = [user_str] + anime_strs
    
    with open("./mal.txt", "w") as file:
        file.write("\n\n".join(strs))

    # with open("./mal.json", "w", encoding="utf-8") as file:
    #     file.write(json.dumps(transformed_mal_data, indent=3, cls=EnhancedJSONEncoder, ensure_ascii=True))