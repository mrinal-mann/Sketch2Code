import { db } from "@/configs/db";
import { usersTable, Sketch2CodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { description, imageUrl, model, uid, email } = await req.json();
    console.log(uid)

    const creditResult = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));

    if (creditResult[0]?.credits && creditResult[0]?.credits > 0) {

        const result = await db.insert(Sketch2CodeTable).values({
            uid: uid.toString(),
            description: description,
            imageUrl: imageUrl,
            model: model,
            createdBy: email
        }).returning({ id: Sketch2CodeTable.id });

        // Update user credits
        const data = await db.update(usersTable).set({
            credits: creditResult[0]?.credits - 1
        }).where(eq(usersTable.email, email));

        return NextResponse.json(result);
    }
    else {
        return NextResponse.json({ 'error': 'Not enough credits' })
    }
}

export async function GET(req: Request) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams?.get('uid');
    const email = searchParams?.get('email');
    if (uid) {
        const result = await db.select()
            .from(Sketch2CodeTable)
            .where(eq(Sketch2CodeTable.uid, uid));
        return NextResponse.json(result[0]);
    }
    else if (email) {
        const result = await db.select()
            .from(Sketch2CodeTable)
            .where(eq(Sketch2CodeTable.createdBy, email))
            .orderBy(desc(Sketch2CodeTable.id))
            ;
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'No Record Found' })

}

export async function PUT(req: NextRequest) {
    const { uid, codeResp } = await req.json();

    const result = await db.update(Sketch2CodeTable)
        .set({
            code: codeResp
        }).where(eq(Sketch2CodeTable.uid, uid))
        .returning({ uid: Sketch2CodeTable.uid })

    return NextResponse.json(result);

}