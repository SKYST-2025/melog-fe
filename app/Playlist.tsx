import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { mockingData } from './data/mockingData';
import { Moment } from "@/objects/moment/model";

interface Song {
  title: string;
  artist: string;
  comment: string;
  emoji: string;
  imageUri: string;
  date?: string;
}

// Moment[] → Record<"Month - Week", Song[]>로 변환
/*
const groupByWeek = (data: Moment[]) => {
  const result: Record<string, Song[]> = {};
  const weeks = ["April - Week 1", "April - Week 2", "April - Week 3", "April - Week 4", "April - Week 5", "May - Week 1", "May - Week 2", "May - Week 3", "May - Week 4"];
  weeks.forEach(week => {
    result[week] = []; // 일단 빈 배열로 초기화
  });

  data.forEach(moment => {
    const dateObj = new Date(moment.date);
    //const month = dateObj.toLocaleString('default', { month: 'long' });
    const month = dateObj.toLocaleString("en-US", { month: "long" });
    // const week = `Week ${Math.ceil(dateObj.getDate() / 7)}`;
    const weekNumber = Math.ceil(dateObj.getDate() / 7);
    const key = `${month} - Week ${weekNumber}`;

    const song: Song = {
      title: moment.description,
      artist: moment.mood,
      comment: moment.description,
      emoji:
        moment.mood === 'verygood' ? '😄' :
        moment.mood === 'good' ? '😊' :
        moment.mood === 'normal' ? '😐' :
        moment.mood === 'bad' ? '😟' :
        '😞',
      imageUri: moment.photoUri,
      date: moment.date,
    };

    if (!result[key]) result[key] = [];
    result[key].push(song);
  });

  return result;
};
*/
const groupByWeek = (data: Moment[]) => {
    const result: Record<string, Song[]> = {};
  
    // 먼저 필요한 주차들을 선정해 미리 초기화 (원하는 범위 확장 가능)
    const weeks = [
      "April - Week 1", "April - Week 2", "April - Week 3", "April - Week 4", "April - Week 5",
      "May - Week 1", "May - Week 2", "May - Week 3", "May - Week 4", "May - Week 5"
    ];
    weeks.forEach(week => result[week] = []);
  
    // 유틸 함수: 해당 날짜가 그 달의 몇 번째 "일요일 시작 주"인지 계산
    const getWeekOfMonth = (date: Date) => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const dayOfWeek = startOfMonth.getDay(); // 0 (일) ~ 6 (토)
      const offsetDate = date.getDate() + dayOfWeek;
      return Math.ceil(offsetDate / 7);
    };
  
    data.forEach(moment => {
      const dateObj = new Date(moment.date);
      const month = dateObj.toLocaleString("en-US", { month: "long" });
      const weekNumber = getWeekOfMonth(dateObj); // 정확한 week 계산
      const key = `${month} - Week ${weekNumber}`;
  
      const song: Song = {
        title: moment.description,
        artist: moment.mood,
        comment: moment.description,
        emoji:
          moment.mood === 'verygood' ? '😄' :
          moment.mood === 'good' ? '😊' :
          moment.mood === 'normal' ? '😐' :
          moment.mood === 'bad' ? '😟' :
          '😞',
        imageUri: moment.photoUri,
        date: moment.date,
      };
  
      if (!result[key]) result[key] = [];
      result[key].push(song);
    });
  
    return result;
  };
  

const weeklyPlaylists = groupByWeek(mockingData);
const weeks = Object.keys(weeklyPlaylists);

const Playlist = () => {
  const [weekIndex, setWeekIndex] = useState(0);
  const currentWeek = weeks[weekIndex];
  const playlist = weeklyPlaylists[currentWeek];

  const changeWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && weekIndex > 0) {
      setWeekIndex(weekIndex - 1);
    } else if (direction === 'next' && weekIndex < weeks.length - 1) {
      setWeekIndex(weekIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeWeek('prev')}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.monthText}>{currentWeek.split(' - ')[0]}</Text>
          <Text style={styles.weekText}>{currentWeek.split(' - ')[1]}</Text>
        </View>
        <TouchableOpacity onPress={() => changeWeek('next')}>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlist}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.albumArt} />
            <View style={styles.songText}>
              <Text style={styles.title}>{item.title} - {item.artist}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  weekText: {
    fontSize: 18,
    color: '#555',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  songText: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  comment: {
    color: '#444',
  },
  emoji: {
    fontSize: 24,
  },
});

export default Playlist;
