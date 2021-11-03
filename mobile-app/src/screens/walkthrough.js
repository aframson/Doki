import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	ScrollView,
	Dimensions,
	Animated,
	FlatList,
	StyleSheet,
	Image,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { colors } from '../common/theme';
import { Icon } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

let val = 0;

const SwipeData = [
	{
		i: 1,
		title: 'Welcome to Doki.',
		desc: 'Secure . time conscious . availability.',
		img:require('../../assets/images/3-min.jpg'),
	},
	{
		i: 2,
		title: 'Request for a delivery.',
		desc: 'Place an order for delivery to be made from one location to another.',
		img:require('../../assets/images/1-min.jpg'),
	},
	{
		i: 3,
		title: 'Track Delivery Location.',
		desc: 'Track your orders and monitor delivery process.',
		img:require('../../assets/images/2-min.jpg'),
	},
	{
		i: 4,
		title: 'Secure Your Packages.',
		desc: 'Know your delivery is safe with a security code available to only you and your rider.',
		img:require('../../assets/images/4-min.jpg'),
	}
];

export default class Walkthrough extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scrollX: new Animated.Value(0),
			val:0,
		};
	}


	Next = () =>{
		let c = this.state.val;
		this.flatlist.scrollToIndex({index:c += 1,animated:true})
		this.setState({val:this.state.val += 1});
	};

	render() {
	

		const opac = this.state.scrollX.interpolate({
			inputRange: [0, width, width * 2, width * 3, width * 4],
			outputRange: [1,1,1, 1,1],  
			extrapolate: 'clamp',
		});


		const index1 = this.state.scrollX.interpolate({
			inputRange: [0,width, width * 2, width * 3],
			outputRange: [colors.BLUE.secondary,'#eee','#eee', '#eee'],
			extrapolate: 'clamp',
		});
		const index2 = this.state.scrollX.interpolate({
			inputRange: [0,width, width * 2, width * 3],
			outputRange: ['#eee',colors.BLUE.secondary,'#eee', '#eee'],
			extrapolate: 'clamp',
		});
		const index3 = this.state.scrollX.interpolate({
			inputRange: [0,width, width * 2, width * 3],
			outputRange: ['#eee','#eee',colors.BLUE.secondary, '#eee'],
			extrapolate: 'clamp',
		});
		const index4 = this.state.scrollX.interpolate({
			inputRange: [0,width, width * 2, width * 3],
			outputRange: ['#eee','#eee','#eee',colors.BLUE.secondary],
			extrapolate: 'clamp',
		});

		return (
			<View style={{backgroundColor:'white',flex:1 }}>

                <FlatList
				    ref={ref => (this.flatlist = ref)}
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					scrollEventThrottle={16}
					horizontal
					data={SwipeData}
					keyExtractor={(item) => item.i.toString()}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }], {
						useNativeDriver: false,
					})}
					renderItem={({ item, index }) => (
						<View style={{ width, height:height-100, margin: 'auto'}} key={index}>
							<View style={styles.infoBar}>
								<Animated.View 
								   style={{
										// borderWidth:1,
										width,
										height:height/2,
										// transform: [{translateX: MoveUp}],
										backgroundColor:colors.BLUE.secondary,
									}}>
							     	<Image style={{height:null,width:null,flex: 1}} source={item.img}/>
								</Animated.View>
								<Text style={{
									fontSize: 30,
									fontWeight: 'bold',
									padding:20,

								}}>{item.title}</Text>
								<Animated.Text style={{
									padding:20,
									fontSize: 20,
									marginTop:-20,
									color:'gray',
									width:300,
									transform: [{translateX:opac}],
								}}>{item.desc}</Animated.Text>
							</View>
						</View>
					)}
				/>

				<View style={{width,height:100,bottom:0,position:'absolute',padding:10}}>
                 

                {this.state.val == 3 ?(
                  <TouchableOpacity
					onPress={() => this.props.navigation.navigate('Through')}
					style={{
						width:150,
						height:40,
						backgroundColor: colors.BLUE.secondary,
						color:'white',
						marginLeft:width-200,
						borderRadius:5,
						justifyContent: 'center',
						textAlign:'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					 <Text style={{color:'white'}}>Get Started</Text>

					<Icon
					// onPress={() => dropBack()}
					name="check"
					color={'white'}
					size={24}
					type="feather"
					containerStyle={{
					
						marginLeft: 10,
						
					}}
				/>
					</TouchableOpacity>

					):(
						<TouchableOpacity 
						onPress={() => this.Next()}
						style={{
							width:100,
							height:40,
							backgroundColor: colors.BLUE.secondary,
							color:'white',
							marginLeft:width-150,
							borderRadius:5,
							justifyContent: 'center',
							textAlign:'center',
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						 <Text style={{color:'white'}}>Next</Text>
						<Icon
						// onPress={() => dropBack()}
						name="arrow-right"
						color={'white'}
						size={24}
						type="feather"
						containerStyle={{
						
							marginLeft: 10,
							
						}}
					/>
						</TouchableOpacity>
					)}
					
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	
});
