# NoBS

NoBS is a very easy and simple way to make shortened links. It's so easy in fact that you could make a link in under a minute.
To make a link simply Sign in with GitHub, choose your privacy settings and share!

There are also some privacy settings you can set (which can be useful for things like events). You can either set a link as public where anyone can use your link and visit it, or set the link to Password-Protected which means that only people which have the code you set will be able to access your link.

For fun (and to not annoy people), NoBS includes a RDS (Rickroll Detection System) that will check your provided link against known rickroll links. This list is always being maintained for the *safety* of our users (you!).

## Can I log in any other way?

At the moment, **no**. But we do plan in the future to add more ways to log in. However this would mean that auto-login would partially not work as you would need to choose as sign in method but we can always try. The most likely sign in methods we can/will add will be Apple (Needs me to pay $100 (maybe fundraiser goal??)), GitHub (Already done) and Google sign in (easiest to add next). I am always open to try other log in auths though but all OAuth goes via Supabase. For Hack Club users (OAuth may be coming to you soon!).

## Why make this?

Well I'm apart of [Hack Club](https://hackclub.com) and I was needing to go and run a coding workshop at a local school near me, so I thought why not make a link shortner as well as the links I would have to put on my presentations or give out would be REALLY long. Now I made this and found out people were actually interested in it as well.

## Can I self-host?

Yes you can, and this is just an Next.js project. You will need Supabase, Vercel and GitHub OAuth if you want to mirror this project though. Just clone this repository and run `npm install` to install all requirements, then in the `.env.example` replace all the missing values with the new correct values from Supabase. In Supabase you can run the SQL command in [sql.txt](sql.txt) to create everything you'll need. After that just simply make a GitHub OAuth bot and set it up in Supabase.

> [!NOTE]
> I don't recommend self-hosting this project at all. It is a pain in the ass to attempt to set up and you'll regret it.

## Can I have higher limits?

If you really need higher limits for links, you will either need to be a maintainer of this project, a supporter (plans TBD) or for other reasons which I'm happy to discuss via rjhj8647@gmail.com.

The limits are on by default at 10 to stop the service from being used maliciously, and also remember that at all times, we serve the right to delete links at any point in time.

## What's next?
The next plans of what to add are filters for malware and bad-domains similar to the rickroll filter, but will either block the creation or just also prompt the user to be cautious. I also plan to eventually add analytics to links only for when links are clicked. The project could also evolve to have a reporting system, but it's limitless on what can be added next.

## For Horizons peeps
Uhh normally I would link to Lapse timelapses here, but I don't have any at the moment, so please watch [this instead](https://bgbs.vercel.app/6I1dcZ). (yes yes very funny).