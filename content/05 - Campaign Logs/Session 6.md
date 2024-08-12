---
title: Session 5
draft: false
order: 6
---

### Encounter 4: The Verdant Tyrant

#### Setting:

- The vast throne room is a tangled jungle of massive vines that cover the walls and ceiling, pulsating with malevolent energy.
- In one corner, a pool of acidic sap bubbles ominously, its fumes adding a noxious edge to the air.
- Spore-releasing flowers dot the room, their toxic pollen drifting lazily through the air like a sinister mist.
- The walls are alive with creeping vines that seem to writhe and shift, as if guided by an unseen will.
- The throne itself is nearly obscured by a thick web of vegetation, a dark figure barely visible within the tangled mass.
- As you step into the room, the ground squelches beneath your feet, the roots and plants reacting to your presence.
- A heavy, oppressive air fills the chamber, thick with the scent of decay and the sweet, cloying odor of blooming flowers.
- The dim light filtering through the overgrowth casts eerie shadows that dance and flicker across the room.
- Every breath you take feels tainted by the spores, the air itself a weapon in this living nightmare.
- The Verdant Tyrant, a monstrous figure entwined with vines and flowers, sits upon the throne, its eyes glowing with a malevolent green light.

#### The Verdant Tyrant (CR 9)

This creature resembles a draconic plant hybrid, with bark-like scales, leaf-wings, and thorny protrusions.

**AC:** 18 (Natural Armor) 
**HP:** 225
**Speed:** 40 ft., fly 80 ft., climb 40 ft.

**STR:** 19 (+4), **DEX:** 12 (+1), **CON:** 17 (+3), **INT:** 16 (+3), **WIS:** 13 (+1), **CHA:** 15 (+2)

**Saving Throws:** Dex +4, Con +6, Wis +4, Cha +5 
**Skills:** Deception +5, Perception +4, Stealth +4 
**Damage Immunities:** Poison 
**Condition Immunities:** Poisoned
**Senses:** Blindsight 30 ft., Darkvision 120 ft., Passive Perception 14

**Traits:**

- **Amphibious:** The Verdant Tyrant can breathe air and water.
- **Regeneration:** The Verdant Tyrant regains 5 HP at the start of its turn if it has at least 1 HP.

**Actions:**

- **Multiattack:** The Verdant Tyrant makes three attacks: one with its bite and two with its claws.
- **Bite:** Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 7 (2d6) poison damage.
- **Claw:** Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.
- **Poison Breath (Recharge 5-6):** The Verdant Tyrant exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking  (8d6) poison damage on a failed save, or half as much damage on a successful one.
- **Entangling Roots (Recharge 5-6):** The Verdant Tyrant causes vines and roots to burst from the ground in a 20-foot radius. This area becomes difficult terrain, and any creature in the area must succeed on a DC 14 Strength saving throw or be restrained. A creature can use its action to make a DC 14 Strength check to free itself or another creature within reach.

**Legendary Actions (3/Round):**

- **Claw Attack:** The Verdant Tyrant makes one claw attack.
- **Spore Cloud (Costs 2 Actions):** The Verdant Tyrant releases a cloud of spores in a 15-foot radius. Each creature in the area must succeed on a DC 14 Constitution saving throw or be poisoned until the end of its next turn.
- **Regenerative Burst (Costs 3 Actions):** The Verdant Tyrant taps into the life force of the castle, regaining 15 (3d8 + 2) hit points.


#### LOGIC BABY

totalHP = 200
isFirstTurn = true
abilitiesUsed = {
    PoisonBreath: false,
    EntanglingRoots: false,
    RegenerativeBurst: false
}

**Abilities Available:**
- [x] **PoisonBreath** 
	- [ ] The Verdant Tyrant exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (8d6) poison damage on a failed save, or half as much damage on a successful one.
- [x] **EntanglingRoots**
	- [ ] The Verdant Tyrant causes vines and roots to burst from the ground in a 20-foot radius. 
	      Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. 
	      A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.
- [x] **RegenerativeBurst**
	- [ ]  The Verdant Tyrant taps into the life force of the castle, regaining 15 (3d8 + 2) hit points.


If totalHP >= 160 || isFirstTurn {
    IF **Entangling Roots** is available,
        THEN use **Entangling Roots.**
    IF it is the Verdant Tyrant's turn and Poison Breath is available,
        THEN use **Poison Breath** on the largest group of players.
    isFirstTurn = false
} elseif totalHP <= 50 {
    **Action**: Use **Regenerative Burst** if it has not been used yet.
        IF !abilitiesUsed.RegenerativeBurst {
            Verdant Tyrant uses Regenerative Burst.
            abilitiesUsed.RegenerativeBurst = true
        }
    **Move**: Fly to avoid melee range, positioning near the acidic sap pool.
} elseif totalHP <= 150 AND abilitiesUsed.EntanglingRoots {
    **Action**: Use **Poison Breath** if available.
        IF Poison Breath is available,
            THEN use Poison Breath.
    **Move**: Stay airborne, attacking from range with Bite and Claw attacks.
} elseif totalHP <= 150 {
    **Move**: Fly close to the ceiling to avoid melee attacks.
    **Action**: Use **Entangling Roots** 
        IF Entangling Roots is available,
            THEN use Entangling Roots.
    **Action**: Use **Spore Cloud** as a legendary action to poison players.
        IF Spore Cloud is available,
            THEN use Spore Cloud.
    abilitiesUsed.EntanglingRoots = true
} else {
    **Move**: To the closest player, focusing on those in difficult terrain.
    **Attack**: Using strongest available ability.
        **MultiAttack**: Three attacks (one **bite**, two **claws** )
	        **Bite:** Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 7 (2d6) poison damage.
			**Claw:** Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.
}




##### Environmental Hazards:

- **Acidic Sap Pool:** Any creature that starts its turn in the pool takes 2d6 acid damage.
- **Spore-Releasing Flowers:** At initiative count 20, flowers release spores in a 10-foot radius. Creatures in the area must make a DC 12 Constitution save or be poisoned for 1 minute.

 **Well of Renewal**
	Any creature using an action to drink from it regains **2d8+5** hit points.
	**3 charges**, replenishing at the start of each round.




**After defeating the dragon, a new portal opens, leading them to the Study (under the castle)**. 

---


### 12. Botanical Study

> _“Descending the stairs brings you to a chamber filled with books, vials and strange instruments. The sweet scent of the flowers further in the chamber mixes with a biting scent that clings to the back of your throat. Clearly many alchemical components are present here, presenting a danger to careless hands.”_

- Samples of the various experiments that were conducted here are still present, as well as many alchemical components, books on both botany and alchemy, instruments of all sorts and scrolls filled with strange arcane symbols.
- One versed in both matters of the arcane and the study of nature could work many wonders here or create more terrible magical concoctions.

**If the players search the bookshelves and research bench, they can find:**

##### The Rise and Fall of the Vrael
  ![[The Rise and Fall of the Vrael]]
##### A Partially Torn World Map (Hook to WC and the open world)
  ![[bottom-left-map.jpg]]

##### You find a crumpled piece of parchment
among the old books and alchemical equipment in the basement. The handwriting is hurried but legible:

> To whomever finds this, 
> 
> I must confess that I feel a deep shame for what we have done. The statue upstairs, the one molded after the great hero who once saved our village, hides more than just his likeness. Bound within the statue itself is his powerful weapon, a tool for good that could turn the tide against the darkness that has fallen upon us.    
> 
> It is tragic that such a powerful artifact is locked away, hidden in plain sight, when it could be used to protect and save our people. The hero it was modeled after would never have wanted it to be kept like this. He believed in action, in fighting for what is right, and in using his gifts to make the world a better place.    
> 
> If you have found this note, I implore you to go upstairs and investigate the statue. The weapon bound within it could be the key to restoring hope to this cursed place.
> 
> May you succeed where we have failed.

##### Research Notes mentioning about Lunashards
> To those who may come after,
> 
> I write this with a heavy heart and a mind burdened by concern. I fear the Lunashards are becoming scarce. And, with Vyra's rise to power, I fear for the future. She has shown a dangerous ambition, one that could lead to disastrous consequences. There are whispers that she might do something rash, something that could involve the royals. I hope with all my being that she refrains from any such actions.
> 
> The Lunashards are already rare, and if Vyra's plans lead to further conflict, we could face a dire shortage. This would not only cripple our constructs but also weaken our defenses against the looming threats. The balance we have maintained for so long is fragile, and any disruption could spell catastrophe.
> 
> If you find this note, please understand the gravity of the situation. The power of the Lunashards must be preserved, and our actions must be measured and wise. 
> 
> May wisdom guide us through these dark times.

##### Piranha Potion Recipe

>  **Ingredients:**
> 	- 3 Royal Roses
> 	- 1 Verdant Dragon Scale
> 	- 1 Gaseous Spore 
> 	- 1 Ophiocordyceps Unilateralis Stroma 
> 	- Arcane Knowledge
> 
> **Steps:** 
> 
> 1. Carefully grind all dry ingredients together to make a fine powder. 
> 2. Slowly pour dry ingredients with magically infused water from one of Castle Thorn's fountains. 
> 3. Bring mixture to a boil while slowly infusing with arcane. 
> 
> **Be VERY careful. I shouldn't have to tell you just how dangerous the Piranha Potion could be in the wrongs hands.** And if you fail any of these steps, you'll likely create another rogue Awdreetoo... so be ready to deal with that if your competence is not your forte. 

###### Craft That Potion

If the players attempt to do some alchemy here send them through a skill check gauntlet. If they succeed, they'll create the [[Piranha Potion]].

Creating a super powerful potion should be a challenging and rewarding process. Here is a detailed progression with three very difficult skill checks:

###### Stage 1: Gathering Rare Ingredients

- **Skill Check:** Nature (or Survival)
- **DC:** 18
- **Description:** "You need to locate and gather rare ingredients from the dangerous and magical areas surrounding the castle. This requires an in-depth knowledge of the local flora and a keen eye for detail."
- **Success:** "You successfully identify and gather the rare ingredients needed for the potion. These ingredients are crucial for the potion's potency."
- **Failure:** "You struggle to find the right ingredients and end up with a mixture of common plants. You can try again after spending more time searching, but it will delay the process."

###### Stage 2: Brewing the Base Potion

- **Skill Check:** Arcana (or Alchemist's Supplies proficiency)
- **DC:** 20
- **Description:** "You must carefully brew the base potion, ensuring that the magical properties of the ingredients are correctly extracted and combined. This requires precise control over the brewing process and a deep understanding of magical alchemy."
- **Success:** "You manage to brew the base potion perfectly, creating a strong foundation for the super powerful potion."
- **Failure:** "The potion mixture starts bubbling uncontrollably, and you have to quickly dispose of it to prevent an explosion. You will need to gather the ingredients again and start over."

###### Stage 3: Infusing with Magical Energy

- **Skill Check:** Arcana (or Spellcasting Ability)
- **DC:** 22
- **Description:** "The final step involves infusing the potion with a concentrated burst of magical energy. This requires channeling your magical power directly into the potion without destabilizing it."
- **Success:** "You successfully infuse the potion with magical energy, resulting in a super powerful potion that glows with an intense, magical light."
- **Failure:** "The infusion process goes awry, causing the potion to become volatile and lose its potency. You will need to brew a new base potion and try the infusion again. **One Awdreetoo spawns with half HP.** "

![[Piranha Potion]]



##### A Letter From Thomas Thorne
![[A Letter from Thomas Thorne]]
### The Boat - Currently Named "The Elderbranch"

- You find a boat ornated with many flowers and roses. 
- All the supplies on this boat are currently spoiled.
- If cleaned and restocked, this ship could serve as a player Hub. 

### Players Agency

I dont know what the players will do now... 
- There's a new Boat. Maybe they sail off to start a pirate adventure. 
- They could go back to town for the nothing reward for clearing Castle Thorne.
- Maybe they want to go talk to Elara to figure out if she knows anything else..
- Maybe they want to go west and check out Dawnham?

