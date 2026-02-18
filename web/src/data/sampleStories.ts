export interface Story {
    id: string;
    title: string;
    author: string;
    excerpt: string;
    category: string;
    ageGroup: string;
    imageUrl?: string;
    content: StorySection[];
}

export interface StorySection {
    type: 'text' | 'question';
    content: string;
    questionType?: 'reflection' | 'discussion' | 'activity';
}

export const sampleStories: Story[] = [
    {
        id: '1',
        title: "Alice's Adventures in Wonderland",
        author: 'Lewis Carroll',
        excerpt: 'Follow Alice down the rabbit hole into a world of wonder, where nothing is quite as it seems...',
        category: 'Classic Literature',
        ageGroup: '8-12',
        imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80',
        content: [
            {
                type: 'text',
                content: 'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"'
            },
            {
                type: 'question',
                content: 'How do you feel when you\'re bored? What do you usually do to make yourself feel better?',
                questionType: 'reflection'
            },
            {
                type: 'text',
                content: 'So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.'
            },
            {
                type: 'question',
                content: 'Alice noticed something unusual. When was the last time you noticed something that surprised you? How did it make you feel?',
                questionType: 'discussion'
            },
            {
                type: 'text',
                content: 'There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet.'
            },
            {
                type: 'question',
                content: 'Alice decided to follow the rabbit even though it seemed strange. Have you ever been curious about something new or different? What happened?',
                questionType: 'reflection'
            }
        ]
    },
    {
        id: '2',
        title: 'The Little Prince',
        author: 'Antoine de Saint-Exupéry',
        excerpt: 'A young prince travels from planet to planet, learning about life, love, and what truly matters...',
        category: 'Modern Classic',
        ageGroup: '10-14',
        imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80',
        content: [
            {
                type: 'text',
                content: 'Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal.'
            },
            {
                type: 'question',
                content: 'The narrator remembers something from when they were young. What\'s a memory from when you were even younger that stayed with you?',
                questionType: 'reflection'
            },
            {
                type: 'text',
                content: 'I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them. But they answered: "Frighten? Why should any one be frightened by a hat?" My drawing was not a picture of a hat. It was a picture of a boa constrictor digesting an elephant.'
            },
            {
                type: 'question',
                content: 'Have you ever felt like someone didn\'t understand what you were trying to say? How did that make you feel?',
                questionType: 'discussion'
            }
        ]
    },
    {
        id: '3',
        title: 'The Courage Tree',
        author: 'Mindshiftr Original',
        excerpt: 'A young sapling learns that being different can be a strength, not a weakness...',
        category: 'Original Story',
        ageGroup: '6-10',
        imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80',
        content: [
            {
                type: 'text',
                content: 'In a forest where all the trees grew tall and straight, there was one small tree that grew differently. While the others reached straight up to the sky, this little tree\'s branches curved and twisted in unusual ways.'
            },
            {
                type: 'question',
                content: 'Have you ever felt different from others around you? What made you feel that way?',
                questionType: 'reflection'
            },
            {
                type: 'text',
                content: 'The other trees would whisper when the wind blew through their leaves. "Look at that strange tree," they would say. "Why can\'t it grow properly like the rest of us?" The little tree felt sad and wished it could be like everyone else.'
            },
            {
                type: 'question',
                content: 'When people say unkind things, how does it make you feel? What can we do when someone says something that hurts our feelings?',
                questionType: 'discussion'
            },
            {
                type: 'text',
                content: 'One day, a terrible storm came to the forest. The wind howled and the rain poured down. The tall, straight trees swayed dangerously in the wind, and some of them even broke. But the little tree, with its curved and flexible branches, bent with the wind and stayed strong.'
            },
            {
                type: 'question',
                content: 'The little tree\'s differences helped it survive the storm. Can you think of a time when something that made you different turned out to be helpful or special?',
                questionType: 'reflection'
            },
            {
                type: 'text',
                content: 'After the storm, the other trees looked at the little tree with new respect. "You were brave," they said. "Your different way of growing made you strong." From that day on, the little tree was proud of being unique, and it was known throughout the forest as the Courage Tree.'
            },
            {
                type: 'question',
                content: 'What does courage mean to you? Can you think of a time when you were brave?',
                questionType: 'activity'
            }
        ]
    },
    {
        id: '4',
        title: 'The Friendship Garden',
        author: 'Mindshiftr Original',
        excerpt: 'Two very different flowers learn that friendship can bloom in unexpected places...',
        category: 'Original Story',
        ageGroup: '6-10',
        imageUrl: 'https://images.unsplash.com/photo-1557958114-3d24402bbd93?w=800&q=80',
        content: [
            {
                type: 'text',
                content: 'In a beautiful garden, there grew a bright red rose and a small yellow dandelion. The rose was proud and beautiful, admired by everyone who visited the garden. The dandelion was simple and cheerful, though many people called it a weed.'
            },
            {
                type: 'question',
                content: 'Have you ever judged someone before getting to know them? What happened?',
                questionType: 'reflection'
            },
            {
                type: 'text',
                content: 'One hot summer day, the gardener forgot to water the plants. The rose began to wilt in the heat, its petals drooping sadly. The dandelion, used to surviving in tough conditions, stayed strong. When it saw the rose struggling, it shared the morning dew from its leaves.'
            },
            {
                type: 'question',
                content: 'The dandelion helped the rose even though the rose had been unkind. Why do you think it did that? Have you ever helped someone who wasn\'t nice to you?',
                questionType: 'discussion'
            },
            {
                type: 'text',
                content: 'The rose was surprised and grateful. "Thank you," it whispered. "I\'m sorry I thought I was better than you. You\'re actually very kind and strong." From that day on, the rose and the dandelion became the best of friends, and the garden was more beautiful because of their friendship.'
            },
            {
                type: 'question',
                content: 'What makes someone a good friend? How can we be better friends to others?',
                questionType: 'activity'
            }
        ]
    }
];

export function getStoryById(id: string): Story | undefined {
    return sampleStories.find(story => story.id === id);
}

export function getStoriesByCategory(category: string): Story[] {
    return sampleStories.filter(story => story.category === category);
}

export function getStoriesByAgeGroup(ageGroup: string): Story[] {
    return sampleStories.filter(story => story.ageGroup === ageGroup);
}
