import React, { Component } from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import { List, ListItem, Icon } from 'react-native-elements'

import { initializeMeteorOffline } from './react-native-meteor-offline';

Meteor.connect('ws://localhost:3000/websocket');
initializeMeteorOffline({ log: true });

const data = [
  {
    title: 'Meteor',
    url: 'https://www.meteor.com',
  },
  {
    title: 'Learn React Native + Meteor',
    url: 'http://learn.handlebarlabs.com/p/react-native-meteor',
  },
  {
    title: 'React Native',
    url: 'http://facebook.github.io/react-native/',
  }
];

class RNDemo extends Component {
  addItem = () => {
    const item = data[Math.floor(Math.random() * data.length)];
    Meteor.call('links.insert', item.title, item.url, (error) => {
      if (error) {
        console.log('Insert error', error.error);
      }
    });
  };

  pressItem = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.log('Linking error: ', err));
  };

  render() {
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView>
          <List containerStyle={{ marginTop: 40 }}>
            <ListItem
              title="Connection Status"
              rightTitle={this.props.status.status}
              hideChevron
            />
          </List>
          <List containerStyle={{ marginBottom: 40 }}>
            {this.props.links.map((link) => {
              return(
                <ListItem
                  key={link._id}
                  title={link.title}
                  subtitle={link.url}
                  onPress={() => this.pressItem(link.url)}
                />
              );
            })}
          </List>
        </ScrollView>
        <Icon
          raised
          name='plus'
          type='font-awesome'
          color='#00aced'
          onPress={this.addItem}
          containerStyle={{ position: 'absolute', bottom: 30, right: 20 }}
          disabled
        />
      </View>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('links.all');

  return {
    links: Meteor.collection('links').find(),
    status: Meteor.status(),
  };
}, RNDemo);
