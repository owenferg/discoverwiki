4/23/2026
discoverwiki - a new way to explore the world around you

function:
webapp that makes discovering local wikipedia articles fun
- for now, users dont have an account and data is stored locally on the users device. in the future, i want to implement accounts

aesthetics:
similar to wikipedia but more game-ified. Fonts are fun, times new roman in areas with less importance but more fun in areas that are more game-y. colors are vibrant for users to be able to tell that this is a game and to be visually more interesting. minimalistic to a degree but fun and inviting instead of cold and sleek. 

articles are unlockable. to unlock an article:
- the article must be within 0.1mi of the user
- the user must click on the article

when an article is locked:
- the name is displayed as question marks (take wikipedia article title and convert each character to ? except spaces)
- the image appears as a grey ?

when an article is unlocked
- the article title and image are revealed
- article accent color is coded based on the category of article (based on https://en.wikipedia.org/wiki/Wikipedia:Contents/Categories). color is arbitrary but consistent with categories
- the article is added to your collection, which users can view in a "Collection" tab
- a counter for the user for # of articles is updated, with the total amount of articles in collection
- your "strength"(?)(working title) is updated, which is the sum of the quality points of the articles youve collected. (similar to wikigacha). quality of an article is a integer 1-100, that integer is added to your total.


collection
- articles can be favorited, or sorted into folders besides the favorite folder. 
- in collections tab, there are two main categories - all and favorites. unsorted is just every article listed that youve obtained. favorites is your favorites folder, plus any other folder the user created. users can name the folder to their liking and set an icon for it, which is chosen from a select few icons available to the user. in all, users can sort their articles by a filter. mainly they can sort it by location (city, state/province/region, country, continent), by quality, by date obtained (recent/old), by category. by default all is sorted by date obtained, most recent. 
- articles in the collection feature the date discovered (important, should be near the article title)
- each article card in collections can be expanded to show the first few sentences of an article (ending in ellipses), and also can open a hyperlink to the article

map:
- unlocked articles are represented by dots color coded to the category they are. the user can see every single article theyve discovered and unlocked on the map. 
- locked articles appear as grey ?. only the nearest 20 locked articles show to the user. only articles within 0.1mi can be unlocked. if the article is within that distance, the question mark appears 'glowing' orange on the map. 
- similar to an open world video game (ie breath of the wild), areas on the map without articles discovered are dark, shadowed out. you can still see the underlying basemap but it is much darker. everywhere is dark when a user has no collected articles. an unlocked article removes the shadows in a radius of ~0.1mi around it, since you've 'discovered' the area. this is permanent for the user when they unlock articles. when more of the world is discovered, less of it is shadowed. 

unlocking an article:
- to unlock an article, users can either click the article in the panel or on the map if it is within the distance threshold. unlocking the article reveals the article title, picture, and first few sentences in a congratulatory popup. users can choose to click a hyperlink to read the article or x out of the popup. 
- after unlocked the article is added to the collection and changed to a dot on the map. 
- this is permanently stored with the user's account


4/28/2026
FORMATTING FOR MOBILE:

On site load:
Simple title screen
- Title of website "discoverWiki" horizontally center and vertically towards the top center
- Two buttons "Discover" "View Collection"
- - Clicking either button will bring the user to the respective view. Both views will have consistent tabs at the top named "Discover" "Collection" respectively.
- - These two tabs are boxes flush against the top of the site, consistently taking up a portion of the screen and never hidden

"Discover"
- Orange Button with white text
- Opens map view, fundamentally similar to Google Maps view
- If user hasn't enabled location tracking for the site, prompt user
- - if user denies location tracking, send user back to title screen with informational popup explaining why, dont ever bring them to discover page
- User's location is the initial center of the map, but allows user to pan around (dont start in NYC anymore)
- When in Discover view, tab at the top is highlighted orange with white text, "Collection" not highlighted and is grey with orange text
- Articles are symbolized on the map the current way they are
- On initial, Discover has no popups or cards on the screen 
- Mapbox search bar at the bottom, stylized like google maps search bar, to zoom to location ("Zoom to location...")
- Clicking on an article already unlocked brings up the popup that shows the Title of the article, Picture preview (if available, if not dont have picture), and hyperlink "Read full article"
- Clicking on an article in range and not unlocked yet unlocks the article, brings up popup with top heading "Unlocked!" in big letters, below with article title, picture preview if available, first few sentences of article cut off at arbitrarly length (a few lines) and ends with ..., and hyperlink "Read full article"

"Collection"
- "View Collection" button cannot be pressed if user has no articles in collection yet.
- "Collection" fills the entire screen and has no map, functions as a list of articles users have gathered
- implements same filtering/info as we already have
- im not sure how I want it to be formatted currently, will retouch it later
- When in Collection view, tab at the top is highlighted orange with white text, "Discover" not highlighted and is grey with orange text
- default sorts articles by most recent, each article is a small card with a small picture preview (if available) and the picture preview gradient to the side like the
current implementation.

DESKTOP:
We don't want this site used for desktop, so if the user enters the site on a desktop sized screen, display title screen with subheading:
"This webapp is intended for mobile use. Please open this site on a mobile device"
Later im going to add a screenshot of what the mobile app looks like to the side of this subheading, so for now just introduce a mobile-size screen div that is where
i will enter the image later.

i need to map wikipedia data
i dont know what else i might need to map, simpler might be better in the context of this project
