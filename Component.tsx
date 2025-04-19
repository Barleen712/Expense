import React from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { categoryMap } from './Screens/Constants';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { selectTransactions } from './Slice/Selectors';
import styles from './Screens/Stylesheet'; // Remove this if you're using inline styles

const MyComponent = () => {
  const data = useSelector(selectTransactions);
  console.log(data)
  const sortedTransactions = [...data].sort((a, b) => {
    return new Date(b.Date) - new Date(a.Date);
  });
  const isToday = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate.toDateString() === today.toDateString();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = new Date(date);
    return targetDate.toDateString() === yesterday.toDateString();
  };

  const formatDate = (date) => {
    if (isToday(date)) return 'Today';
    else if (isYesterday(date)) return 'Yesterday';
    else return format(new Date(date), 'MMM dd, yyyy');
  };

  const groupedData = sortedTransactions.reduce((acc, item) => {
    const formattedDate = formatDate(item.Date);
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groupedData).map((date) => ({
    title: date,
    data: groupedData[date],
  }));

  const renderItem = ({ item }) => {
    const date = new Date(item.Date);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${meridiem}`;

    return (
      <TouchableOpacity
        style={{
          margin: 4,
          backgroundColor: 'rgba(237, 234, 234, 0.28)',
          height: 80,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ margin: 10 }}>
          <Image
            style={{ width: 60, height: 60 }}
            source={categoryMap[item.moneyCategory === 'Transfer' ? item.moneyCategory : item.category]}
          />
        </View>
        <View style={{ width: '54%', padding: 5 }}>
          <Text style={[styles.balance, { color: 'black', marginTop: 15 }]}>{item.category}</Text>
          <Text style={[styles.categoryText, { color: 'rgba(145, 145, 159, 1)', marginTop: 10 }]}>
            {item.description}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  item.moneyCategory === 'Income'
                    ? 'rgba(0, 203, 179, 1)'
                    : item.moneyCategory === 'Expense'
                    ? 'rgba(253, 60, 74, 1)'
                    : 'rgba(0, 119, 255, 1)',
              },
            ]}
          >
            {item.moneyCategory === 'Income' ? '+' : '-'}${item.amount}
          </Text>
          <Text>{formattedTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id.toString() + index.toString()}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <View style={styles.header}>
          <Text style={styles.headerText}>{section.title}</Text>
        </View>
      )}
    />
  );
};

export default MyComponent;
