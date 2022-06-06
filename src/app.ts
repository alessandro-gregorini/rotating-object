/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';

//======================================
// Convert a rotation from Unity-style Euler angles to a Quaternion.
// If null or undefined passed in, use a 0 rotation.
//======================================
function Unity2QuaternionRotation(euler: MRE.Vector3Like):
	MRE.Quaternion {
	return euler ? MRE.Quaternion.FromEulerAngles(
		euler.x * MRE.DegreesToRadians,
		euler.y * MRE.DegreesToRadians,
		euler.z * MRE.DegreesToRadians
	) : new MRE.Quaternion();
}

/*
 * sleep() function
 *
 * Returns a Promise that resolves afer 'ms' milliseconds.  To cause your code to pause for that
 * time, use 'await sleep(ms)' in an async function.
 */
function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
	private kitItem: MRE.Actor = null;
	private assets: MRE.AssetContainer;

	constructor(private context: MRE.Context) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
		// set up somewhere to store loaded assets (meshes, textures,
		// animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);

		// spawn a copy of a kit item
		this.kitItem = MRE.Actor.CreateFromLibrary(this.context, {
			// the number below is the item's artifact id.
			resourceId: 'artifact:1559131536496787746',
			actor: {
				transform: {
					local: {
						scale: { x: 0.25, y: 0.25, z: 0.25 }
					}
				}
			}
		});

		//====================
		// Call an async function to "pulse" the size of the kit item in a loop.
		//====================
		this.rotateActor(this.kitItem);
	}

	//==========================
	// Rotate the actor 30 degrees around the z axis every second.
	//
	// 'async' makes the function run asynchronously from the test of the code.  That means when this function
	// is called, it returns immediately and runs "separately" from the rest of the code.
	//
	// WARNING: NOT PRODUCTION CODE!  This code is for class explanation only.  If you include the function
	// below in your MRE, your app will not exit, even after all users leave.
	//==========================
	private async rotateActor(actor: MRE.Actor) {
		let angle = 0;

		// The for(; ;) syntax below sets up an infinite loop
		for (; ;) {
			// Sleep for 1 seconds.  The "await" makes the function actually wait for the promise returned
			// by 'sleep' to be resolved.
			await sleep(1000);

			// Rotate the actor 30 degrees.
			angle += 30;
			actor.transform.local.rotation
				= Unity2QuaternionRotation({ x: 0, y: 0, z: angle } as MRE.Vector3Like);
		}

	}
}
