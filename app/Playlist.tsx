import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { weeklyPlaylists, Song } from './data/playlistData';

const weeks = Object.keys(weeklyPlaylists);

const Playlist = () => {
  const [weekIndex, setWeekIndex] = useState(0);

  const currentWeek = weeks[weekIndex];
  const playlist: Song[] = weeklyPlaylists[currentWeek];

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
